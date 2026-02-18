output "project_id" {
  value = var.project_id
}

output "region" {
  value = var.region
}

output "service_account_email" {
  value = google_service_account.clipora_sa.email
}

output "uploads_bucket" {
  value = google_storage_bucket.uploads.name
}

output "processed_bucket" {
  value = google_storage_bucket.processed.name
}

output "processed_bucket_url" {
  value = "https://storage.googleapis.com/${google_storage_bucket.processed.name}"
}

output "pubsub_topic" {
  value = google_pubsub_topic.video_processing.name
}

output "pubsub_subscription" {
  value = google_pubsub_subscription.video_processing_sub.name
}

output "db_instance_name" {
  value = google_sql_database_instance.clipora_db.name
}

output "db_connection_name" {
  value = google_sql_database_instance.clipora_db.connection_name
}

output "db_public_ip" {
  value = google_sql_database_instance.clipora_db.public_ip_address
}

output "db_private_ip" {
  value = google_sql_database_instance.clipora_db.private_ip_address
}

output "vpc_connector" {
  value = google_vpc_access_connector.connector.name
}

output "artifact_registry" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.clipora_repo.repository_id}"
}
