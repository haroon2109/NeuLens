# NeuLens
## A longitudinal brain-health screening and clinical decision-support platform

[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Edge%20AI-0284c7.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](#)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](#)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](#)
[![Express](https://img.shields.io/badge/Express-4.19-green.svg)](#)
[![Prisma](https://img.shields.io/badge/Prisma-5.12-2d3748.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](#)
[![MediaPipe](https://img.shields.io/badge/Vision%20AI-MediaPipe%20Tasks-FF6F00.svg)](#)
[![Gnani AI](https://img.shields.io/badge/Speech%20AI-Gnani%20v2.5%20(Timbre%20%2B%20Prisma)-7c3aed.svg)](#)
[![Tests](https://img.shields.io/badge/Tests-81%20Passing-brightgreen.svg)](.github/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

---

## The problem, in one person

> **Illustrative case — not a real patient record.** Fatima is 68 and screens at
> baseline. She returns three times over the next two years; with three comparable
> repeat pairs the platform can measure her own session-to-session variability. Her
> latest score falls further than that spread accounts for, and because language, task
> version, education and sensory access match across all four sittings, the movement
> becomes a question for her clinician — not a diagnosis, and not a number on a
> dashboard.

Everything below exists to make that paragraph true and defensible: a personal baseline
instead of a population cut-off, a change signal that stays silent until it beats the
person's own noise, and an explicit refusal to substitute a score for a measurement that
never happened. The limitations are listed further down, after the evidence, in
[Limitations and how they are enforced](#limitations-and-how-they-are-enforced).

**Start here:** [`docs/future-health-challenge/ONE_PAGE_SUMMARY.md`](docs/future-health-challenge/ONE_PAGE_SUMMARY.md) — the one-page front door: summary, video, architecture, evidence, limitations and validation roadmap, one link each.

**Contents**

- [The problem, in one person](#the-problem-in-one-person)
- [1. Executive Summary & Overview](#1-executive-summary--overview) — what it is, the challenge fit
- [Limitations and how they are enforced](#limitations-and-how-they-are-enforced)
- [2. Architecture & API reference](#2-architecture--api-reference) — links to `docs/ARCHITECTURE.md` and `docs/API_REFERENCE.md`
- [3. Environment Setup & Configuration](#3-environment-setup--configuration)
- [4. Installation & Local Development](#4-installation--local-development)
- [5. Deployment & Production Guide](#5-deployment--production-guide)
- [6. License & Attribution](#6-license--attribution)

---

## 1. Executive Summary & Overview

### Positioning
**NeuLens**  
*A longitudinal brain-health screening and clinical decision-support platform.*

NeuLens combines accessible cognitive assessments, camera-based ocular observations, speech and behavioural measurements, and relevant health-context information to help clinicians identify meaningful changes over time, support personalized prevention and coordinate timely clinical care.

### Four measurement pillars
- **Cognitive** — Memory, attention, executive function and language.
- **Ocular** — Gaze and eye-movement observations.
- **Vocal** — Speech and acoustic observations.
- **Behavioural** — Facial landmarks and task-related movement observations.

### The intelligence layer
**Personal baseline → Change detection → Health context → Prevention → Clinical review → Follow-up.**

This is aligned with longitudinal, clinician-in-the-loop brain-health screening and follow-up (rather than producing a standalone cognitive risk score).

### High-level purpose
NeuLens is a browser-based, clinician-supervised screening aid — not a diagnostic system. It centers personal brain-health baselines, safety-gated meaningful change detection, health-context integration, clinician review, longitudinal follow-up, and quality/fairness measurement. Its interactive tasks collect exploratory signals that may support follow-up conversations; they are not validated measures or diagnostic tests. The platform records exploratory observations across modalities, including:
1. **Ocular Saccades & Fixation Stability** via sub-pixel iris tracking.
2. **Vocal Acoustics & Micro-Prosody** via real-time Web Audio fast Fourier transform (FFT) analysis.
3. **Speech-to-Text Clinical Transcription** via **Gnani AI Prisma v2.5** across English (Indian) and five Indian languages. Arabic audio input is **not** transcribed; Arabic spoken responses fall back to on-screen text.
4. **Facial Kinematics & Bilateral Symmetry** via 478 3D facial mesh landmarks.
5. **Psychomotor Processing & Executive Planning** via digital Trail Making and pattern-retention matrices.

The MVP stores a prototype composite score and session telemetry for review. Its change monitor compares within-person results only when recorded language, task version, education, and accessibility conditions match, and it will only report a score decline that exceeds the patient's **own measured session-to-session variability** (1.96 × SD of change across consecutive comparable repeat pairs — a reliable change index). With fewer than three repeat pairs there is no threshold, so no score-based decline is reported in either direction and the record states that reliability is not yet estimated. This is the patient's own measured noise, not a population-validated reliable-change statistic; local language, cultural, age, education, sensory-access, and digital-literacy validity has not been established.

**What happens when an activity cannot run.** The battery uses a camera (eye and facial activities) and a microphone (spoken repeat). If one is unavailable, declined or the participant leaves the activity, that activity records no score and a reason (`CAMERA_UNAVAILABLE`, `MICROPHONE_UNAVAILABLE`, `SKIPPED`, `TIME_LIMIT`) — the server never substitutes a default, and the missing domain makes the composite non-interpretable. `taskResponses.administration` records exactly which activities were measured; the clinician's draft lists the unmeasured domains and why. Leaving an activity mid-way used to award 50–88 points; those constants are gone.

**Accessibility scope, stated precisely.** No activity requires precise pointing: the moving target is a focusable button, and the trail-making activity can be completed with the number keys 1–6. Activity changes and instructions are announced through a live region for screen-reader users. The platform does let a participant continue without a camera or microphone, in which case the affected domains are reported as unmeasured rather than estimated. It does **not** yet offer a telephone-only or fully non-visual administration path for the camera- and audio-dependent activities, and no screen-reader usability study has been run.

> **Medical Disclaimer**: *Neulens identifies changes in screening and self-reported function that may warrant further assessment. It does not diagnose disease or recommend treatment. Results are exploratory decision support and require review by a qualified professional.*

---

### Challenge fit (Abu Dhabi — Future Health Digital Innovation Challenge)

NeuLens is presented against the *Protecting Brain Health Earlier* brief with an explicit
requirements-to-evidence map and a measurement plan:

- **[`docs/future-health-challenge/SUBMISSION_FIT.md`](docs/future-health-challenge/SUBMISSION_FIT.md)** — maps the problem, objective and each desired outcome (culturally valid assessment, longitudinal change detection, integrated risk context, personalized prevention and timely care, safety and human oversight, validation and local population performance) to what is implemented, what is deliberately not claimed, and what remains.
- **[`docs/future-health-challenge/MEASUREMENT_AND_LOCAL_VALIDATION.md`](docs/future-health-challenge/MEASUREMENT_AND_LOCAL_VALIDATION.md)** — operational definitions for completion, repeat-session stability, sensitivity, specificity, meaningful-change detection, false-referral burden and time to clinical assessment, with the segmented analysis plan and the linguistic/cultural adaptation register.
- **[`docs/future-health-challenge/VALIDATION_STUDY_PLAN.md`](docs/future-health-challenge/VALIDATION_STUDY_PLAN.md)** — Abu Dhabi pilot protocol: cohort, reference standard, sensitivity/specificity/ICC targets, segment analysis by language/age/education, and acceptance criteria before any clinical claim.
- **[`docs/future-health-challenge/DEMONSTRABLE_VALUE.md`](docs/future-health-challenge/DEMONSTRABLE_VALUE.md)** — one-page evidence sheet for the "Demonstrable value" requirement: completion, comparability, time to clinical review, referral completion, repeat-session stability and banded fairness measures from a fixed-seed simulated cohort, with the command that reproduces every figure and an explicit statement that none of it is clinical-validity evidence.

This is a research-stage, safety-first screening-support platform with a validation
roadmap — not a validated diagnostic tool. Arabic task wording is translated and
delivered (the verbal recall stimulus and the sequencing-task instructions are Arabic;
the remaining task copy — activity titles, intros, prompts and button labels — is
English); back-translation, cognitive pretesting, local clinical sign-off and reviewed
Arabic speech remain open. That state is enforced, not just documented: the language screen
reads the same registry the server enforces, marks each language's real status, and a
participant may only continue in a not-yet-reviewed language after an explicit
acknowledgement that is stored with the session and reported to the clinician.

Local fit: Arabic is a first-class right-to-left interface language with Arabic-script
fonts; education, language, task version and sensory/digital access are matched before
any within-person comparison; family history and consent-gated genomic context are
source-labelled in clinician review; optional wearable summaries are a consent-gated
context source; and population metrics are reported by language, age band and education
band.

---

## Limitations and how they are enforced

Declared rather than discovered, and placed after the evidence rather than before it. Each item names where it lives in the code so it can be checked.

| # | Defect | Consequence | Where |
| --- | --- | --- | --- |
| 1 | No locally validated task wording, and no licensed validated screener. Arabic has a delivered verbal-recall stimulus and piano-sequencing instructions plus registry-declared pending stages; the rest of the task copy is English. | No cross-language or cross-cultural score claim can be made. Readiness is enforced, not papered over. | `server/src/services/assessmentLanguageReadiness.ts`; `docs/future-health-challenge/MEASUREMENT_AND_LOCAL_VALIDATION.md` |
| 2 | No population reliability estimate: ICC(2,1) is computed from real repeat pairs only and withheld below three pairs. | Score change is interpreted against the patient's own variability; no population-level SEM or MDC exists. | `server/src/services/reliability.ts`, `changeMonitor.ts` |
| 3 | Two of the five battery activities need a camera, one needs a microphone. | A participant without them is administered a partial battery whose missing domains are reported unmeasured, not estimated. The cognitive activity route (`/patient/cognitive`) is cameras- and microphone-free but does not feed the composite. There is no telephone or IVR route. | `client/src/features/screening/ScreeningPage.tsx`, `client/src/features/cognitive/TaskPlayer.tsx` |
| 4 | Change detection is inactive until three comparable repeat pairs exist. | On real data today the detector reports "reliability not established"; it is not silently guessing. | `server/src/services/changeMonitor.ts` |
| 5 | Seven languages in the UI, one language declared task-ready (`en`). | Non-English sessions require an explicit participant acknowledgement and are stamped as such in the record. | `language-readiness` route; `taskResponses.languageReadiness` |
| 6 | The legacy `/api/v1/screening` history endpoints still serve a demo record from an in-memory array and do not use the demo-isolation gate that the portal endpoints use. | A demo record can appear in that legacy endpoint's output for the demo patient id only. It is unreachable from the current UI, which uses the portal endpoints. | `server/src/controllers/screening.controller.ts` |
| 7 | Acoustic jitter and shimmer are microphone- and codec-dependent. | They are stored as acoustic quality features only: excluded from scoring, change detection and patient endpoints. | `server/src/services/patientAssessmentView.ts`; `server/src/tests/acousticScope.test.ts` |
| 8 | No screen-reader usability study has been run, and the battery is not operable without vision. | Live-region announcements and keyboard controls exist; they are not a validated non-visual administration. | `client/src/features/screening/ScreeningPage.tsx` |
| 9 | The exploratory cognitive task catalogue is research-stage and unvalidated. | Each activity is labelled as such in the UI and never produces a diagnosis. | `client/src/features/cognitive/catalog*.ts` |

Items 1–3 and 5 are not closable by editing code: they need licensing, an ethics-approved reliability study, or an accessibility design study. They are listed here so the gap is a known limitation rather than a discovered one.

---

### Key Features
* **Zero-Install Client-Side Edge Inference**: Operates directly in standard web browsers using WebAssembly (Wasm) and WebGL GPU acceleration. Selected video and audio signals are processed locally in real-time on the device. Raw media is not recorded or uploaded; only derived measurements are sent to the backend.
* **5 Exploratory Sensory & Cognitive Micro-Tasks** (not locally validated diagnostic instruments):
  * *Task 1: Focus Orbit* — Saccadic latency, smooth pursuit velocity, Eye Aspect Ratio (EAR), and fixation hold endurance.
  * *Task 2: Cortex Match* — Working memory recall, spatial pattern matching, and decision reaction latency.
  * *Task 3: Vocal Echo* — Spoken phrase repetition evaluating speech rate (words or syllables per minute), fundamental frequency ($F_0$), vocal jitter, shimmer, pauses, intensity and task word accuracy, paired with Gnani Prisma v2.5 speech transcription.
  * *Task 4: Mimic Sync* — Dynamic facial mimicry assessing bilateral smile intensity, jaw displacement, eyebrow elevation, and head pose stability (3D yaw/pitch/roll).
  * *Task 5: Path Mapper* — Digital Trail Making Test (TMT Part B equivalent) measuring executive sequencing, psychomotor speed, and path error rates.
* **Pure Gnani AI Multilingual Voice Assistant ("Neulens")**:
  * Spoken audio synthesized **exclusively** via **Gnani AI Timbre v2.5** (`https://api.vachana.ai/api/v1/tts/inference`) across all seven interface languages: English (`en`), Arabic (`ar`, `ar-AE`, voice `Zahira`), Hindi (`hi`), Tamil (`ta`), Telugu (`te`), Kannada (`kn`) and Malayalam (`ml`). Arabic output is configured but the voice is not yet clinically reviewed.
  * **Zero Voice Overlap Architecture**: Browser speech synthesis failover is completely eliminated. Active session concurrency guards (`activeSessionId`), `AbortController` network termination, and audio lifecycle teardown ensure that only **one** clean, natural Gnani voice can play at any millisecond.
  * In-memory SHA-256 prompt caching optimizing upstream API credit consumption.
* **Verbal Assessment Transcription (Gnani Prisma v2.5)**:
  * Backend REST pipeline (`POST /api/v1/voice/transcribe`) transmitting patient verbal recordings to Gnani Prisma REST v3 with language-specific numeral formatting and confidence scores.
* **Hospital Dual-Portal Architecture (Role-Separated)**:
  * **Patient Portal (`/patient`)**: Patient-facing platform experience designed for elderly users and people with low digital literacy, accessible from any browser. A first-run path through registration, language, the screening battery and a completion slip is described below as a **guided first-run journey**; the portal itself has around thirty further screens (history, trends, change, context, prevention, appointments, cognitive activities) reachable from its own navigation, not a fixed nine-screen sequence:
    * **Step 1 (Screen 1 — Welcome Page `/patient`)**: Minimal, spacious homepage with Neulens branding and two large touch targets: "New Patient" and "Existing Patient".
    * **Step 2 (Screen 2 — Registration `/patient/register` & Screen 3 — Login `/patient/login`)**: Simple registration with essential demographics issuing a collision-resistant Patient ID (`CV-2026-XXXXXX`), or 2-field login with Patient ID + PIN (the PIN is the only accepted factor; the fictional jury demo account is listed under [Jury demo access](#jury-demo-access)). A new account lands on its own dashboard (`/patient/dashboard`) — the same destination as signing in — where starting the assessment is an explicit choice rather than an automatic redirect.
    * **Step 3 (Screen 4 — Language Selection `/patient/language`)**: High-contrast regional language selection (Arabic — right-to-left, English, Tamil, Hindi, Telugu, Kannada, Malayalam) with native script and, where a reviewed voice exists, spoken audio previews powered by Gnani Timbre TTS. Arabic is offered with full RTL layout and Arabic-script fonts for navigation, consent, check-in and results; the verbal-recall stimulus and the piano-sequencing instructions are administered in Arabic, while the rest of the task copy remains English. Each entry shows its real status from `GET /api/v1/language-readiness` — English is task-ready, other languages read "wording under review" with the pending stages listed — and continuing in one requires an explicit acknowledgement that travels with the session (`taskResponses.languageReadiness`) and appears in the clinician's evidence/limitations. `POST /patient/assessment` refuses an unacknowledged non-ready language with `422 LANGUAGE_NOT_VALIDATED`. It is a guided option before a first assessment, not a forced step: language is also set in My profile and Account settings.
    * **Step 4 (Screens 5–6 — Welcome & Screening Battery `/patient/assessment`)**: Calm "Let's Begin" welcome followed by exploratory tasks (*Focus Orbit*, *Cortex Match*, *Vocal Echo*, *Mimic Sync*, *Path Mapper*) with spoken voice guidance, repeat instruction button, and dynamic typography scaling (`A` / `A+` / `A++`). Live facial tracking and audio telemetry execute in the background without exposing raw biometric diagnostics (EAR, yaw/pitch/roll) to the patient.
    * **Step 5 (Screen 7 — Optional Daily-Function Check-in)**: Four large-touch questions about everyday activities, presented in the selected language. Responses can be skipped and are stored with the screening for within-person comparison.
    * **Step 6 (Screen 8 — Patient ID Confirmation `/patient/assessment/complete`)**: Reassuring completion message with prominent Patient ID display, downloadable text confirmation slip, and print layout. The completion screen itself shows no scores or notes.
    * **Patient-visible data policy**: One policy, enforced server-side in `server/src/services/patientAssessmentView.ts` with an explicit allowlist. A patient receives the measurements from their own sessions (composite score, activity summaries, session quality) plus clinician notes only after review. Clinical risk classifications, the raw acoustic research features (`jitter`, `shimmer`) and any field not named in that allowlist are never returned by patient endpoints.
    * **Step 7 (Screen 9 — Return Home)**: Safe session reset returning to the portal home page.
  * **Doctor Portal (`/doctor`)**: Streamlined clinician workspace with unified 3-item navigation (**Overview**, **Patients**, **Settings**) and a separate Patient Portal shortcut. The **Patients** section serves as the central workspace where clinicians search enrolled patients, open records, review chronological assessment histories with task telemetry and within-person change cues, launch screening tasks bound to patient records, and prepare reports for clinician review. Reports are not diagnoses or validated clinical instruments.
* **Longitudinal Change Monitor**:
  * Each screening offers a multilingual check-in for four everyday activities plus sleep, physical activity, mood/stress, sensory access, and digital familiarity. It can be skipped.
  * A score-based change prompt requires three comparable repeat pairs (four comparable screens) with matching task version, language, education, and recorded access conditions; the decline must exceed 1.96 × the SD of that patient's own change. Below three pairs the platform reports "reliability not established" rather than either a change or stability claim. The observed score spread is displayed as a description, never used as a threshold.
  * A reported functional or context change is also a review prompt. There is no population-validated reliability coefficient or meaningful-change threshold in this MVP; the threshold above is the patient's own measured variability.
* **Integrated Risk Context (Family History + Genomic, Optional)**:
  * Family history and current conditions/medications are recorded as source-labelled context inputs and shown to the reviewing clinician, not kept as a local text field.
  * Genomic context is **optional and consent-gated**: it is stored only when the patient explicitly opts in, is returned to the clinician only with that consent, and is never interpreted, risk-scored, or used to change a score. NeuLens states this boundary in the patient and clinician interfaces.
  * Genomic interpretation, variant-level risk modelling and family-history-based genetic risk calculation are explicitly out of scope.
* **Authorized FHIR R4 Context (Optional)**:
  * With explicit per-session patient permission and server-side configuration, imports recent supported FHIR `Observation` resources using LOINC codes for blood pressure, glucose, cholesterol, weight, step count, sleep duration, and PHQ-2 score.
  * Supports open FHIR R4 servers such as HAPI FHIR or Medplum through a configured HTTPS endpoint and bearer token. No endpoint or credentials are bundled; live connectivity must be configured and tested in the deployment environment.
  * Imports are read-only and limited to the supported code list and the previous 12 months. This MVP does not write to the external record or claim interoperability certification.
* **Clinician-Owned Follow-up**:
  * Clinicians can save a proposed repeat screen, context review, clinical review, or daily-function support action and optional date/notes to an assessment record.
  * Recommendations are discussion prompts; only the qualified clinician confirms next steps. Context associations do not establish causality.
* **Dual-Tier Resilient Persistence**:
  * Production-grade PostgreSQL database managed through Prisma ORM.
  * In-memory failover fallback store enabling seamless offline demonstrations, field pitch deployments (e.g., NBEC 2026), and sandbox testing without live database dependencies.
* **Caregiver & Family Vigilance Portal**:
  * Medication adherence tracker (e.g., Donepezil, Memantine, Omega-3), specialist appointment scheduling, vigilance notification feeds, and emergency clinician contact integration.
* **Clinical Reporting & Doctor Share Gateway**:
  * One-click browser print/PDF export formatted for hospital intake records.
  * Secure clinician referral notes and longitudinal trend curves.

---

### Backend, Database & AI Processing Stack

The platform's open-source data and AI layer is documented in
[`docs/backend-architecture.md`](docs/backend-architecture.md), with a
verified tool-by-tool map in
[`docs/technology-stack.md`](docs/technology-stack.md).

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| Database | **PostgreSQL** (Supabase) | Clinical records, assessments, reports metadata |
| Authentication | **Supabase Auth** (optional) | Supabase JWT verification is available in FastAPI; Express-issued JWTs remain active during migration |
| Access control | **Row Level Security** | Policies in `supabase/migrations/0001_init.sql`; roles are server-assigned only |
| File storage | **Supabase Storage** | Private `clinical-documents` and `assessment-reports` buckets, path-scoped to the patient |
| Realtime | **Supabase Realtime** | `notifications` streamed to the signed-in recipient only |
| AI processing | **FastAPI** (Python) | Voice, ocular, facial, cognitive and longitudinal pipelines in `ai-service/` |

Neither the Supabase service-role key nor any model provider key is available to
the browser: the React app holds only the public anon key, and AI processing is
performed by the FastAPI service with server-side credentials.

Dataset sourcing, access terms and the staged validation plan — including why
no single public dataset covers all four modalities — are documented in
[`docs/research-datasets.md`](docs/research-datasets.md). The boundary between
deterministic scoring and LLM-written explanations, including the local Ollama
deployment and guardrails, is in
[`docs/ai-report-generation.md`](docs/ai-report-generation.md).

The narrow initial clinical use case, pilot/evidence plan, validation and
regulatory path, and the business model to test are documented in
[`docs/funding-and-validation/`](docs/funding-and-validation/README.md).

### Tech Stack At-a-Glance

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | React 18.3, TypeScript 5.9, Vite 5.4 |
| **Styling & Design System** | Tailwind CSS 3.4, PostCSS, shadcn/ui (Radix primitives + `class-variance-authority`), custom medical-UI tokens |
| **State & Data Fetching** | Zustand 4.5 (Auth, Face Tracking, Screening, Language, Voice Assistant), TanStack Query 5.107 (portal API queries) |
| **Forms & Validation** | React Hook Form 7.83, Zod 4.6 with `@hookform/resolvers` |
| **Icons & Charts** | Lucide React 0.368, Recharts 3.10, Framer Motion 11.18 |
| **Computer Vision (Client Edge)**| Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision` v1.0.1 Wasm/Float16, BlazeFace, 478 3D Mesh Landmarks) |
| **Speech-to-Text (STT)** | **Gnani AI Prisma v2.5** (REST v3 endpoint `/stt/v3` via secure backend proxy `/api/v1/voice/transcribe`) |
| **Text-to-Speech (TTS)** | **Gnani AI Timbre v2.5** (REST endpoint `/api/v1/tts/inference` via backend `/api/v1/voice/synthesize`, 24kHz PCM WAV) |
| **Acoustic Signal Processing** | Web Audio API (`AudioContext`, `AnalyserNode`, real-time FFT) plus the FastAPI analyser: librosa, Praat via `praat-parselmouth`, Silero VAD for speech/non-speech detection (MIT, CPU `torch`, energy fallback) |
| **Speech Hotword Navigation** | Web Speech API (continuous keyword recognition for hands-free 'repeat' / 'help' commands) |
| **Explanation Drafting** | **Ollama** local open-weights model (Qwen/Llama/Gemma/Mistral), constrained to rephrasing deterministic metrics with a template fallback; optional external Evon gateway gated by data-processing approval |
| **Backend Runtime & Framework**| Node.js 20+, Express 4.19, TypeScript 5.4, Multer (in-memory audio buffer handling) |
| **Database & ORM** | PostgreSQL 14+, Prisma ORM 5.12, In-Memory Resilient Mock Store Fallback |
| **Authentication & Security** | JSON Web Tokens (`jsonwebtoken` 9.0), `bcryptjs` 2.4, CORS 2.8, Zod 4.6; Supabase Auth supported as the optional migration path |
| **AI Service** | FastAPI, Pydantic 2, NumPy; optional scikit-learn / SciPy / statsmodels research extras under `ai-service/requirements-research.txt` |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert`) for the API, pytest for the AI service |

---

## 2. Architecture & API reference

The detail lives in two companion documents so this file stays readable as a front door:

- **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** — architecture style, privacy-by-design boundaries, high-level data flow, the system diagram, repository layout, per-component responsibilities, and the data model (Prisma schema, ERD, speech/AI model architecture).
- **[`docs/API_REFERENCE.md`](docs/API_REFERENCE.md)** — every endpoint group: system and health, authentication, patient portal, doctor portal, screenings, analytics, and the Gnani voice/speech integration.

In one paragraph: the React/Vite client performs MediaPipe vision and Web Audio measurement locally and uploads only derived measurements; an Express/TypeScript server owns scoring, comparability gating, change detection and the clinician workflow over PostgreSQL via Prisma; Gnani supplies text-to-speech and speech transcription. Raw video and audio never leave the device.

---

## 3. Environment Setup & Configuration

### Prerequisites
* **Runtime**: Node.js `v18.18.0` or higher (`v20.x` LTS recommended).
* **Package Manager**: `npm` `v9.x` or higher (or `pnpm`).
* **Database**: PostgreSQL `14.0+` (local service, Docker container, or managed service such as Supabase / AWS RDS). If PostgreSQL is not active, the backend automatically engages its in-memory store.
* **Browser Requirements**: Chromium-based browser (Google Chrome 110+, Microsoft Edge 110+) for full WebAssembly GPU acceleration and Web Audio support.

---

### Environment Variables Template

#### Backend (`server/.env`)
Create a `.env` file in `/server`:
```env
# -------------------------------------------------------------
# Neulens — Backend Environment Configuration
# -------------------------------------------------------------

# Server Port & Networking
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Database (PostgreSQL)
# When PostgreSQL is not active, server automatically falls back to in-memory mock store
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cognivision?schema=public"

# Security & JWT Secrets
# Generate a unique value per deployment: openssl rand -hex 32
# Never commit the real value or reuse a documentation example.
JWT_SECRET="<generate with: openssl rand -hex 32>"

# -------------------------------------------------------------
# Gnani AI Speech Integration
# -------------------------------------------------------------
# Base URL for Gnani / Vachana Speech Services
GNANI_API_BASE_URL="https://api.vachana.ai"

# Secret API Key provided by Gnani AI (transmitted exclusively via X-API-Key-ID header)
# Keep strictly server-side; NEVER expose in client bundles!
GNANI_API_KEY="your_gnani_api_key_here"

# Upstream request timeout in milliseconds
GNANI_TIMEOUT_MS=15000

# -------------------------------------------------------------
# Optional: Patient-Consented FHIR R4 Context Import
# -------------------------------------------------------------
# Server-only. Use an HTTPS FHIR R4 endpoint; loopback is allowed for development.
FHIR_BASE_URL=""
# Supply through a deployment secret manager; never expose this to the client.
FHIR_BEARER_TOKEN=""
# Identifier system used when searching a FHIR Patient (optional).
FHIR_IDENTIFIER_SYSTEM="urn:neulens:patient-id"

# -------------------------------------------------------------
# Optional: Gnani Evon 30B Reasoning Model Gateway
# -------------------------------------------------------------
EVON_INFERENCE_URL=""
EVON_API_KEY=""
# Explicit privacy/data-processing approval is required before any assessment
# data is sent to an external model endpoint. Leave false for local-only use.
EVON_DATA_PROCESSING_APPROVED=false
```

#### Frontend (`client/.env`)
Create an optional `.env` file in `/client` (defaults will fallback to Vite proxy):
```env
# Base Backend API URL for Production Deployments
VITE_API_URL="/api/v1"
```

---

## 4. Installation & Local Development

### Step-by-Step Setup Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Neulens.git
cd Neulens
```

#### 2. Backend Installation & Database Setup
```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials & GNANI_API_KEY

# Generate Prisma Client and apply database schema migrations
npm run prisma:generate
npm run prisma:migrate
```

#### 3. Frontend Installation
```bash
# Navigate to client directory
cd ../client

# Install frontend dependencies
npm install
```

---

### Running Development Servers

Open two terminal sessions or run concurrently:

**Terminal 1 (Backend API)**:
```bash
cd server
npm run dev
# Server will initialize on http://localhost:5000
# [Neulens Server]: Running on http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```bash
cd client
npm run dev
# Vite server will start on http://localhost:5173
```

Navigate to `http://localhost:5173` in your browser. The Vite development server automatically proxies `/api` calls to `http://localhost:5000`.

---

### Automated Test Suite Execution

The backend contains an automated test suite covering the Gnani voice catalog, Timbre v2.5 TTS, Prisma v2.5 STT, controllers, the Evon gateway, portal integration and deployment health:

```bash
cd server
npm test
```
*Output: 55 tests passing across 19 suites in ~5s (`npm --prefix server test`). The same command runs in CI together with the client typecheck and production build — see [`.github/workflows/ci.yml`](.github/workflows/ci.yml).*

---

### Demo & Quickstart Credentials

### Jury demo access

For prototype evaluation, the server seeds two fictional, verified accounts at startup. The portals are separate:

- Patient portal: `/patient/login` (Patient ID + PIN, or the one-click patient demo)
- Clinician portal: `/doctor/login` (email + password, or the one-click clinician demo)

Each portal exposes only its own one-click **Jury demo access** account:

| Role | Sign-in | Patient portal check-in |
| --- | --- | --- |
| Patient (Margaret Ellis, fictional) | `patient.demo@neulens.ai` / `DemoPatient2026!` | `CV-2026-DEMO01` / PIN `246810` |
| Clinician (Dr. Amara Okafor, fictional) | `doctor.demo@neulens.ai` / `DemoDoctor2026!` | — |

The demo patient also has four synthetic screening records so the clinician dashboard, review queue, and longitudinal view are populated. No real patient data is used.

Those fictional records are isolated: they are visible **only** inside the demo workspace. A real clinician's dashboard, patient directory and platform insights never count them, so demonstration data cannot move a real patient count, comparability rate or reliability estimate (`server/src/services/demoRecords.ts`, covered by `tests/demoIsolation.test.ts`).

Demo seeding is on by default for local and jury use. Disable it before a real clinical deployment, and never enable it on an instance that contains real patient records:

```bash
DEMO_ACCESS_ENABLED=false
```

### Evaluation (database-agnostic)

The server runs either against PostgreSQL or an in-memory fallback, both exposed through the same `HospitalDataStore` interface, so an evaluator can run the platform without a live database.

1. Start the backend (`npm --prefix server run dev`) and the frontend (`npm --prefix client run dev`).
2. Use the one-click demo accounts above, or create a real clinician with the included script:
   ```bash
   npx ts-node --project server/tsconfig.json server/scripts/clinician-create.ts
   ```
   The script prints the clinician email, PIN, and a one-time onboarding redirect — it does not write credentials into the UI.
3. Real patient registration remains available through the patient portal; the demo accounts are separate and clearly labelled as fictional.

---

## 5. Deployment & Production Guide

### Containerization (Docker & Docker Compose)

#### 1. Backend Dockerfile (`server/Dockerfile`)
```dockerfile
# Multi-stage Node.js build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 5000
CMD ["node", "dist/app.js"]
```

#### 2. Frontend Dockerfile (`client/Dockerfile`)
```dockerfile
# Stage 1: Build static assets with Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve via high-performance Nginx Alpine
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Production Multi-Container Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cognivision_postgres
    restart: always
    environment:
      POSTGRES_USER: cogni_user
      # Set a strong value in the environment; do not commit a real password.
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set a strong POSTGRES_PASSWORD}
      POSTGRES_DB: cognivision_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: cognivision_api
    restart: always
    environment:
      PORT: 5000
      NODE_ENV: production
      DATABASE_URL: "postgresql://cogni_user:${POSTGRES_PASSWORD}@postgres:5432/cognivision_db?schema=public"
      JWT_SECRET: "${JWT_SECRET}"
      CLIENT_ORIGIN: "https://cognivision.yourdomain.com"
      GNANI_API_KEY: "${GNANI_API_KEY}"
      GNANI_API_BASE_URL: "https://api.vachana.ai"
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: cognivision_web
    restart: always
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  pgdata:
```

---

### Production CI/CD & Build Verification

To verify production readiness before deployment:
```bash
# 1. Frontend Type-Check & Build
cd client
npm run type-check    # Verifies zero TypeScript compilation errors
npm run build         # Emits optimized production bundle to client/dist

# 2. Backend Test & Build
cd ../server
npm test              # Executes 25 integration tests (Portal & Gnani AI suites)
npm run build         # Compiles TypeScript to server/dist
npm run start         # Runs compiled production artifact
```

---

## 6. License & Attribution

Developed for the **National Bio Entrepreneurship Competition (NBEC 2026)**.  
Licensed under the **MIT License**. See `LICENSE` for details.

### Reproducing this document's state

The file [`scripts/neulens-snapshot.sh`](scripts/neulens-snapshot.sh) captures the exact dependency-integrity, build, and test state behind the figures in this README. Run it in a clean checkout to confirm parity.
