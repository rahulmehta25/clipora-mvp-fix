# LetsGoViral

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)
![GCP](https://img.shields.io/badge/GCP-Cloud_Run-4285F4?logo=googlecloud&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-8E75B2?logo=google&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?logo=ffmpeg&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?logo=terraform&logoColor=white)

AI-powered viral clip generator. Upload long-form video, get back the best short-form clips for TikTok, Reels, and YouTube Shorts.

## Overview

LetsGoViral automates the most time-consuming part of content repurposing: finding the moments that will actually perform. Upload a 20-minute video and the platform returns 5-10 ranked clips, each with a virality score and strategic posting order.

The pipeline combines Google's Video Intelligence API for production-grade shot detection, Speech-to-Text for transcription, and Gemini 2.0 Flash for multimodal analysis of what makes content engaging. FFmpeg handles server-side clip extraction so nothing runs on the client.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  React + Vite (web)          │           Expo SDK 54 (mobile)               │
│  web-ui-reference/           │           mobile/                            │
└──────────────────────────────┴──────────────────────────────────────────────┘
                                        │
                                        │ REST + SSE
                                        │ X-API-Key auth
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API Service (Cloud Run)                            │
│                     backend/api-service/ — Node.js/Express                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Project/Video/Clip CRUD                                                   │
│  • Signed URL generation for direct GCS upload                               │
│  • Viralizer AI chat (SSE streaming)                                         │
└────────────────┬─────────────────────────────────┬──────────────────────────┘
                 │                                 │
    ┌────────────┴────────────┐       ┌────────────┴────────────┐
    │   Cloud SQL (Postgres)  │       │   GCS Upload Trigger    │
    │   pgvector extension    │       │   OBJECT_FINALIZE       │
    └─────────────────────────┘       └────────────┬────────────┘
                                                   │ Pub/Sub
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Video Processor (Cloud Run Job)                         │
│                   backend/video-processor/ — Node.js + FFmpeg                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │ Video Intelligence│  │  Speech-to-Text  │  │  Gemini 2.0 Flash │           │
│  │   (shot detect)   │  │  (transcription) │  │ (virality scoring)│           │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘           │
│           │                     │                     │                      │
│           └─────────────────────┴─────────────────────┘                      │
│                                 │                                            │
│                                 ▼                                            │
│                    ┌────────────────────────┐                                │
│                    │       FFmpeg           │                                │
│                    │  (clip extraction)     │                                │
│                    └────────────┬───────────┘                                │
│                                 │                                            │
└─────────────────────────────────┼────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌────────────────────────┐
                    │   GCS Processed Bucket │
                    │     (public read)      │
                    └────────────────────────┘
```

**Infrastructure as Code:** All GCP resources are provisioned via Terraform (`infrastructure/`).

## Why This Architecture

**Video Intelligence API for shot detection.** Rolling your own shot detection means training models, tuning thresholds, and handling edge cases. Google's API returns frame-accurate shot boundaries out of the box, which matters when FFmpeg needs precise cut points.

**Gemini multimodal for virality scoring.** The model sees transcription and shot timestamps together, understanding when a speaker's emphasis aligns with a visual transition. Single-modality approaches miss these correlations. Structured JSON output mode eliminates parsing failures.

**FFmpeg server-side, not client-side.** Mobile devices can't re-encode video efficiently. Server-side extraction with `-preset ultrafast` produces clips in seconds. Input seeking (`-ss` before `-i`) means FFmpeg doesn't decode frames it won't use.

**Parallel web and mobile entry points.** Both clients hit the same API. The web app (React + Vite) handles desktop workflows; the mobile app (Expo) handles on-the-go uploads. One backend, two surfaces.

## Features

- **Automatic clip extraction** — AI identifies the 5-15 best moments based on video duration
- **Virality scoring** — Each clip gets a 1-10 hook score and strategic posting rank
- **Direct GCS upload** — Signed URLs enable large file uploads without proxying through the API
- **Processing status polling** — Mobile app polls until processing completes, with gesture-locked progress screen
- **Viralizer AI chat** — SSE-streamed conversation for script refinement
- **Clip approval workflow** — Review, approve, or reject each generated clip

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | Expo SDK 54, React Native 0.81, NativeWind, TanStack Query, Zustand |
| Web | React 18, Vite, TailwindCSS |
| API | Node.js 22, Express, Winston logging |
| Database | PostgreSQL 15 (Cloud SQL), pgvector extension |
| AI | Gemini 2.0 Flash (clip selection), Video Intelligence API, Speech-to-Text |
| Video | FFmpeg (libx264, ultrafast preset) |
| Storage | Google Cloud Storage (uploads + processed buckets) |
| Infrastructure | Terraform, Cloud Run, Pub/Sub, Secret Manager, Artifact Registry |
| CI/CD | GitHub Actions, Workload Identity Federation |

## Getting Started

### Prerequisites

- Node.js 22+
- Terraform 1.5+
- FFmpeg (for local video processor dev)
- GCP project with billing enabled

### 1. Provision Infrastructure

```bash
cd infrastructure
terraform init
terraform plan \
  -var="project_id=YOUR_PROJECT" \
  -var="db_password=SECURE_PASSWORD" \
  -var="mvp_api_key=$(openssl rand -hex 32)"
terraform apply
```

### 2. Initialize Database

```bash
# Via Cloud SQL Auth Proxy or direct connection
psql -h CLOUD_SQL_IP -U clipora -d creator_mvp -f infrastructure/database/init.sql
```

### 3. Run API Service Locally

```bash
cd backend/api-service
cp .env.example .env
# Fill in GCP values from Terraform outputs
npm install
npm run dev
```

### 4. Run Mobile App

```bash
cd mobile
npm install
echo "EXPO_PUBLIC_API_URL=http://localhost:8080" > .env.local
echo "EXPO_PUBLIC_API_KEY=your-api-key" >> .env.local
npx expo start
```

## Deployment

Push to `main` triggers GitHub Actions:

1. Builds Docker images for API service and video processor
2. Pushes to Artifact Registry (`us-east1-docker.pkg.dev/[project]/clipora/`)
3. Deploys API service to Cloud Run
4. Updates video processor job definition
5. Runs API tests against pgvector/pgvector:pg15

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | GCP project ID |
| `GCP_SA_KEY` | Service account key JSON |
| `GCP_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GCS_UPLOADS_BUCKET` | Uploads bucket name |
| `GCS_PROCESSED_BUCKET` | Processed clips bucket name |
| `CDN_BASE_URL` | Base URL for processed clips |
| `DB_HOST` | Cloud SQL private IP |

**Cost tip:** Cloud SQL runs ~$60/month. Stop it when not developing:

```bash
gcloud sql instances patch clipora-db --activation-policy NEVER
# Resume:
gcloud sql instances patch clipora-db --activation-policy ALWAYS
```

## License

MIT
