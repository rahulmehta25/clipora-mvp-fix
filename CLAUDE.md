# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

Clipora is an AI-powered viral clip generator. Users upload long-form videos; the platform uses GCP AI services (Video Intelligence, Speech-to-Text, Vertex AI/Gemini) + FFmpeg to automatically extract and rank short-form clips for TikTok, Reels, and YouTube Shorts.

---

## Development Commands

### Backend — API Service
```bash
cd backend/api-service
npm install
npm run dev          # nodemon hot-reload
npm test             # Jest (requires local Postgres or test env vars)
npm run test:integration
```

Required env vars (copy `.env.example` to `.env`):
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `MVP_API_KEY` — sent as `X-API-Key` header by all clients
- `GCP_PROJECT_ID`, `GCP_REGION`
- `GCS_UPLOADS_BUCKET`, `GCS_PROCESSED_BUCKET`, `CDN_BASE_URL`

### Backend — Video Processor
```bash
cd backend/video-processor
npm install
npm run dev    # nodemon (runs as a Cloud Run Job locally)
```
Requires FFmpeg installed locally (`brew install ffmpeg` on macOS).

### Mobile App
```bash
cd mobile
npm install
echo "EXPO_PUBLIC_API_URL=http://localhost:8080" > .env.local
echo "EXPO_PUBLIC_API_KEY=your-api-key" >> .env.local
npx expo start          # opens Expo DevTools
npx expo start --ios    # iOS simulator
npx expo start --tunnel # for physical device over internet
npm test                # Jest with jest-expo preset
npm run lint            # ESLint
```

### Infrastructure
```bash
cd infrastructure
terraform init
terraform plan -var="project_id=YOUR_PROJECT" -var="db_password=PW" -var="mvp_api_key=$(openssl rand -hex 32)"
terraform apply
```

**Stop Cloud SQL when not developing** (biggest cost driver ~$60/mo):
```bash
gcloud sql instances patch clipora-db --activation-policy NEVER
gcloud sql instances patch clipora-db --activation-policy ALWAYS  # resume
```

---

## Architecture

```
Mobile App (Expo SDK 54, React Native 0.81)
    │  REST + SSE (X-API-Key header required)
    ▼
Cloud Run API Service (Node.js 22 / Express)   ←── backend/api-service/
    │                    │
    │ Cloud SQL (Postgres)│ GCS upload → Pub/Sub trigger
    ▼                    ▼
Cloud SQL (pgvector)  Cloud Run Job (Video Processor) ←── backend/video-processor/
                           │
              ┌────────────┼──────────────────┐
              ▼            ▼                  ▼
   Video Intelligence  Speech-to-Text    Vertex AI (Gemini)
   (shot detection)    (transcription)   (clip selection, script chat)
                                │
                          FFmpeg → GCS processed bucket → Cloud CDN
```

### Request Authentication

All `/api/*` endpoints require `X-API-Key` header. The key is stored in Google Secret Manager as `clipora-api-key` and injected into Cloud Run at deploy time. The mobile client reads it from `EXPO_PUBLIC_API_KEY`.

### Video Processing Pipeline (async)

1. Mobile uploads video directly to GCS uploads bucket via signed URL (`POST /api/videos/upload-url`)
2. GCS `OBJECT_FINALIZE` event → Pub/Sub `video-processing-topic` → Cloud Run Job
3. Job: Video Intelligence API (shot timestamps) + Speech-to-Text (transcript) → Gemini Flash (clip selection JSON) → FFmpeg (frame-accurate re-encode with `-preset ultrafast`) → GCS processed bucket
4. Mobile polls `GET /api/videos/:id` every 5 seconds until status is `COMPLETED` or `FAILED`

Gemini is called with `responseMimeType: "application/json"` enforcing a structured schema (`clips[]` with `start_time`, `end_time`, `hook_score`, `strategic_rank`, `rationale`). The job retries the Gemini call once on parse failure before marking video as `FAILED`.

FFmpeg uses `-ss` before `-i` (input seeking) and `-c:v libx264 -preset ultrafast -movflags +faststart` — NOT `-c copy`, because stream copy only cuts on keyframes which produces inaccurate timestamps.

---

## Key Architectural Patterns

### Backend (api-service)

- **Routes**: `src/routes/{projects,scripts,videos,clips}.js` — thin Express routers
- **Services**: `src/services/{storage,gemini}.js` — GCP client wrappers
- **DB**: `src/db/index.js` — pg Pool singleton; raw SQL (no ORM)
- **Auth**: `src/middleware/auth.js` — API key middleware applied to all `/api` routes
- Upload limits enforced before issuing signed URLs: 2 GB max file size, 30 min max duration (budget protection — a 2-hour 4K video costs $12+ in Video Intelligence API alone)

### Backend (video-processor)

- Entry point: `src/run-job.js` — reads Pub/Sub message, orchestrates pipeline
- Services: `ffmpeg.js`, `videoIntelligence.js`, `speechToText.js`, `geminiAnalyzer.js`
- Runs in a Docker container with FFmpeg installed (`node:22-slim` + `apt-get install ffmpeg`)

### Mobile App

- **Router**: Expo Router v3 (file-based). Root layout at `app/_layout.tsx` wraps everything in `QueryClientProvider`
- **State**: Zustand (`store/index.ts`) for global client state
- **Data fetching**: TanStack Query (React Query v5) — `useQuery` with `refetchInterval` for processing polling
- **API client**: `api/client.ts` — axios singleton with `X-API-Key` header; GCS uploads use `fetch` directly (axios lacks streaming support on React Native)
- **Styling**: NativeWind (TailwindCSS for React Native)
- Screen structure: `app/(tabs)/` (Home, Upload, Chat, Settings), `app/projects/[id]`, `app/processing/[id]` (polling view, `gestureEnabled: false`), `app/clips/[id]` (modal)

### Infrastructure (Terraform)

- All resources in `us-east1`
- Cloud SQL uses private IP only (accessed through Serverless VPC connector `clipora-vpc-connector`); public IP is enabled for local dev with broad `authorized_networks` — tighten for production
- Uploads bucket has 30-day auto-delete lifecycle rule
- Processed bucket is publicly readable (MVP — no CDN signed URLs yet)

### CI/CD

`.github/workflows/deploy.yml` — triggered on push to `main`:
1. Authenticates via Workload Identity Federation (no long-lived keys)
2. Builds and pushes Docker images to Artifact Registry (`us-east1-docker.pkg.dev/[project]/clipora/`)
3. Deploys API service (`clipora-api`) and updates job definition (`clipora-video-processor`)
4. Runs API tests against a `pgvector/pgvector:pg15` Docker service

Required GitHub Secrets: `GCP_PROJECT_ID`, `GCP_WIF_PROVIDER`, `GCP_SERVICE_ACCOUNT_EMAIL`, `GCS_UPLOADS_BUCKET`, `GCS_PROCESSED_BUCKET`, `CDN_BASE_URL`

---

## Database Schema

PostgreSQL 15 with `pgvector` extension. Tables: `users`, `projects`, `scripts`, `videos`, `clips`, `chat_messages`.

Key fields: `videos.processing_status` (`PENDING` → `PROCESSING` → `COMPLETED`/`FAILED`), `clips.strategic_rank` and `clips.hook_score` (from Gemini), `clips.content_embedding VECTOR(768)` (reserved for future similarity search, HNSW index commented out).

Schema init SQL: `infrastructure/database/init.sql`

---

## Cost Notes

- Video Intelligence API: ~$0.10/min of video analyzed (dominant cost per video)
- Cloud SQL: ~$60/month running 24/7 — stop the instance when not developing
- Per-video total: ~$2.30 for a 20-min video; budget supports ~80–100 test runs on $300 GCP credits
