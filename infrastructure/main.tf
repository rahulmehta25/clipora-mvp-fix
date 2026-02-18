terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

data "google_project" "project" {
  project_id = var.project_id
}

# ─────────────────────────────────────────
# APIs to Enable
# ─────────────────────────────────────────
locals {
  gcp_services = [
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "pubsub.googleapis.com",
    "storage.googleapis.com",
    "videointelligence.googleapis.com",
    "speech.googleapis.com",
    "aiplatform.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "vpcaccess.googleapis.com",
    "compute.googleapis.com",
    "servicenetworking.googleapis.com",
  ]
}

resource "google_project_service" "apis" {
  for_each           = toset(local.gcp_services)
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

# ─────────────────────────────────────────
# Service Account
# ─────────────────────────────────────────
resource "google_service_account" "clipora_sa" {
  account_id   = "clipora-service-account"
  display_name = "Clipora Service Account"
  project      = var.project_id

  depends_on = [google_project_service.apis]
}

locals {
  sa_roles = [
    "roles/run.invoker",
    "roles/pubsub.publisher",
    "roles/pubsub.subscriber",
    "roles/storage.objectAdmin",
    "roles/cloudsql.client",
    "roles/aiplatform.user",
    "roles/secretmanager.secretAccessor",
  ]
}

resource "google_project_iam_member" "sa_roles" {
  for_each = toset(local.sa_roles)
  project  = var.project_id
  role     = each.key
  member   = "serviceAccount:${google_service_account.clipora_sa.email}"

  depends_on = [google_service_account.clipora_sa]
}

# ─────────────────────────────────────────
# Cloud Storage Buckets
# ─────────────────────────────────────────
resource "google_storage_bucket" "uploads" {
  name                        = "${var.project_id}-uploads"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  force_destroy               = true  # Allow deletion for hackathon

  lifecycle_rule {
    action { type = "Delete" }
    condition { age = 30 }
  }

  depends_on = [google_project_service.apis]
}

resource "google_storage_bucket" "processed" {
  name                        = "${var.project_id}-processed"
  location                    = var.region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  force_destroy               = true  # Allow deletion for hackathon

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type", "Content-Length"]
    max_age_seconds = 3600
  }

  depends_on = [google_project_service.apis]
}

# Grant SA object admin on both buckets
resource "google_storage_bucket_iam_member" "uploads_sa" {
  bucket = google_storage_bucket.uploads.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.clipora_sa.email}"
}

resource "google_storage_bucket_iam_member" "processed_sa" {
  bucket = google_storage_bucket.processed.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.clipora_sa.email}"
}

# Allow public read on processed clips (for MVP - no CDN, direct URLs)
resource "google_storage_bucket_iam_member" "processed_public" {
  bucket = google_storage_bucket.processed.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# ─────────────────────────────────────────
# Pub/Sub
# ─────────────────────────────────────────
resource "google_pubsub_topic" "video_processing" {
  name    = "video-processing-topic"
  project = var.project_id

  depends_on = [google_project_service.apis]
}

resource "google_pubsub_subscription" "video_processing_sub" {
  name    = "video-processing-subscription"
  topic   = google_pubsub_topic.video_processing.name
  project = var.project_id

  ack_deadline_seconds       = 600
  message_retention_duration = "3600s"

  retry_policy {
    minimum_backoff = "30s"
    maximum_backoff = "300s"
  }
}

# Grant GCS service account permission to publish to Pub/Sub
resource "google_pubsub_topic_iam_member" "storage_publisher" {
  topic  = google_pubsub_topic.video_processing.name
  role   = "roles/pubsub.publisher"
  member = "serviceAccount:service-${data.google_project.project.number}@gs-project-accounts.iam.gserviceaccount.com"

  depends_on = [
    google_pubsub_topic.video_processing,
    google_storage_bucket.uploads,
  ]
}

# Cloud Storage notification → Pub/Sub on upload finalize
resource "google_storage_notification" "upload_trigger" {
  bucket         = google_storage_bucket.uploads.name
  payload_format = "JSON_API_V1"
  topic          = google_pubsub_topic.video_processing.id
  event_types    = ["OBJECT_FINALIZE"]

  depends_on = [
    google_pubsub_topic_iam_member.storage_publisher,
  ]
}

# ─────────────────────────────────────────
# VPC & Serverless Connector
# ─────────────────────────────────────────
resource "google_vpc_access_connector" "connector" {
  name           = "clipora-vpc-connector"
  region         = var.region
  project        = var.project_id
  network        = "default"
  ip_cidr_range  = "10.8.0.0/28"
  min_throughput = 200
  max_throughput = 300

  depends_on = [google_project_service.apis]
}

# ─────────────────────────────────────────
# Service Networking for Cloud SQL Private IP
# ─────────────────────────────────────────
resource "google_compute_global_address" "private_ip_range" {
  name          = "clipora-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = "projects/${var.project_id}/global/networks/default"
  project       = var.project_id

  depends_on = [google_project_service.apis]
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = "projects/${var.project_id}/global/networks/default"
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]

  depends_on = [google_project_service.apis]
}

# ─────────────────────────────────────────
# Cloud SQL (PostgreSQL 15)
# ─────────────────────────────────────────
resource "google_sql_database_instance" "clipora_db" {
  name             = "clipora-db"
  database_version = "POSTGRES_15"
  region           = var.region
  project          = var.project_id

  deletion_protection = false  # For hackathon - allow easy cleanup

  settings {
    tier              = "db-custom-1-3840"
    availability_type = "ZONAL"
    disk_size         = 20
    disk_autoresize   = true

    ip_configuration {
      ipv4_enabled    = true  # Enable public IP for easier local dev
      private_network = "projects/${var.project_id}/global/networks/default"

      authorized_networks {
        name  = "allow-all"
        value = "0.0.0.0/0"  # For hackathon only - restrict in production
      }
    }

    backup_configuration {
      enabled    = false  # Disable for hackathon to save costs
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }

  depends_on = [
    google_service_networking_connection.private_vpc_connection,
  ]
}

resource "google_sql_database" "creator_mvp" {
  name     = "creator_mvp"
  instance = google_sql_database_instance.clipora_db.name
  project  = var.project_id
}

resource "google_sql_user" "clipora_user" {
  name     = "clipora"
  instance = google_sql_database_instance.clipora_db.name
  password = var.db_password
  project  = var.project_id
}

# ─────────────────────────────────────────
# Secret Manager
# ─────────────────────────────────────────
resource "google_secret_manager_secret" "db_password" {
  secret_id = "clipora-db-password"
  project   = var.project_id
  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

resource "google_secret_manager_secret" "api_key" {
  secret_id = "clipora-api-key"
  project   = var.project_id
  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "api_key" {
  secret      = google_secret_manager_secret.api_key.id
  secret_data = var.mvp_api_key
}

# ─────────────────────────────────────────
# Artifact Registry
# ─────────────────────────────────────────
resource "google_artifact_registry_repository" "clipora_repo" {
  location      = var.region
  repository_id = "clipora"
  format        = "DOCKER"
  project       = var.project_id

  depends_on = [google_project_service.apis]
}
