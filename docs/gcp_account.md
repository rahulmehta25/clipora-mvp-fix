# GCP Account — Clipora

**Account:** clipora994@gmail.com  
**Project ID:** `clipora-487805` (CLIPORA)

Use this Google Cloud Platform account for Clipora infrastructure, Terraform provisioning, and related services (Cloud SQL, Cloud Storage, Pub/Sub, Cloud Run, etc.).

### gcloud setup (one-time)

```bash
gcloud auth login clipora994@gmail.com
gcloud config set project clipora-487805
gcloud auth application-default login   # for Terraform / SDKs (optional)
```
