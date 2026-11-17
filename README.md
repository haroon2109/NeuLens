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
3. **Speech-to-Text Clinical Transcription** via **Gnani AI Prisma v2.5** across 6 regional Indian languages.
4. **Facial Kinematics & Bilateral Symmetry** via 478 3D facial mesh landmarks.
5. **Psychomotor Processing & Executive Planning** via digital Trail Making and pattern-retention matrices.

The MVP stores a prototype composite score and session telemetry for review. Its change monitor compares within-person results only when recorded language, task version, education, and accessibility conditions match, and it will only report a score decline that exceeds the patient's **own measured session-to-session variability** (1.96 × SD of change across consecutive comparable repeat pairs — a reliable change index). With fewer than three repeat pairs there is no threshold, so no score-based decline is reported in either direction and the record states that reliability is not yet estimated. This is the patient's own measured noise, not a population-validated reliable-change statistic; local language, cultural, age, education, sensory-access, and digital-literacy validity has not been established.

**What happens when an activity cannot run.** The battery uses a camera (eye and facial activities) and a microphone (spoken repeat). If one is unavailable, declined or the participant leaves the activity, that activity records no score and a reason (`CAMERA_UNAVAILABLE`, `MICROPHONE_UNAVAILABLE`, `SKIPPED`, `TIME_LIMIT`) — the server never substitutes a default, and the missing domain makes the composite non-interpretable. `taskResponses.administration` records exactly which activities were measured; the clinician's draft lists the unmeasured domains and why. Leaving an activity mid-way used to award 50–88 points; those constants are gone.

**Accessibility scope, stated precisely.** No activity requires precise pointing: the moving target is a focusable button, and the trail-making activity can be completed with the number keys 1–6. Activity changes and instructions are announced through a live region for screen-reader users. The platform does let a participant continue without a camera or microphone, in which case the affected domains are reported as unmeasured rather than estimated. It does **not** yet offer a telephone-only or fully non-visual administration path for the camera- and audio-dependent activities, and no screen-reader usability study has been run.

> **Medical Disclaimer**: *Neulens identifies changes in screening and self-reported function that may warrant further assessment. It does not diagnose disease or recommend treatment. Results are exploratory decision support and require review by a qualified professional.*

## Known defects

Declared rather than discovered. Each item names where it lives in the code so it can be checked.

| # | Defect | Consequence | Where |
| --- | --- | --- | --- |
| 1 | No locally validated task wording, and no licensed validated screener. Arabic has a translated verbal-recall stimulus and registry-declared pending stages, nothing more. | No cross-language or cross-cultural score claim can be made. Readiness is enforced, not papered over. | `server/src/services/assessmentLanguageReadiness.ts`; `docs/future-health-challenge/MEASUREMENT_AND_LOCAL_VALIDATION.md` |
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

### Challenge fit (Abu Dhabi — Future Health Digital Innovation Challenge)

NeuLens is presented against the *Protecting Brain Health Earlier* brief with an explicit
requirements-to-evidence map and a measurement plan:

- **[`docs/future-health-challenge/SUBMISSION_FIT.md`](docs/future-health-challenge/SUBMISSION_FIT.md)** — maps the problem, objective and each desired outcome (culturally valid assessment, longitudinal change detection, integrated risk context, personalized prevention and timely care, safety and human oversight, validation and local population performance) to what is implemented, what is deliberately not claimed, and what remains.
- **[`docs/future-health-challenge/MEASUREMENT_AND_LOCAL_VALIDATION.md`](docs/future-health-challenge/MEASUREMENT_AND_LOCAL_VALIDATION.md)** — operational definitions for completion, repeat-session stability, sensitivity, specificity, meaningful-change detection, false-referral burden and time to clinical assessment, with the segmented analysis plan and the linguistic/cultural adaptation register.
- **[`docs/future-health-challenge/VALIDATION_STUDY_PLAN.md`](docs/future-health-challenge/VALIDATION_STUDY_PLAN.md)** — Abu Dhabi pilot protocol: cohort, reference standard, sensitivity/specificity/ICC targets, segment analysis by language/age/education, and acceptance criteria before any clinical claim.

This is a research-stage, safety-first screening-support platform with a validation
roadmap — not a validated diagnostic tool. Arabic task wording is translated and
delivered (the verbal recall stimulus and the sequencing-task instructions are Arabic);
back-translation, cognitive pretesting, local clinical sign-off and reviewed Arabic
speech remain open. That state is enforced, not just documented: the language screen
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

### Key Features
* **Zero-Install Client-Side Edge Inference**: Operates directly in standard web browsers using WebAssembly (Wasm) and WebGL GPU acceleration. Selected video and audio signals are processed locally in real-time on the device. Raw media is not recorded or uploaded; only derived measurements are sent to the backend.
* **5 Exploratory Sensory & Cognitive Micro-Tasks** (not locally validated diagnostic instruments):
  * *Task 1: Focus Orbit* — Saccadic latency, smooth pursuit velocity, Eye Aspect Ratio (EAR), and fixation hold endurance.
  * *Task 2: Cortex Match* — Working memory recall, spatial pattern matching, and decision reaction latency.
  * *Task 3: Vocal Echo* — Spoken phrase repetition evaluating speech rate (words or syllables per minute), fundamental frequency ($F_0$), vocal jitter, shimmer, pauses, intensity and task word accuracy, paired with Gnani Prisma v2.5 speech transcription.
  * *Task 4: Mimic Sync* — Dynamic facial mimicry assessing bilateral smile intensity, jaw displacement, eyebrow elevation, and head pose stability (3D yaw/pitch/roll).
  * *Task 5: Path Mapper* — Digital Trail Making Test (TMT Part B equivalent) measuring executive sequencing, psychomotor speed, and path error rates.
* **Pure Gnani AI Multilingual Voice Assistant ("Neulens")**:
  * Spoken audio synthesized **exclusively** via **Gnani AI Timbre v2.5** (`https://api.vachana.ai/api/v1/tts/inference`) across 6 languages: English (`en`), Hindi (`hi`), Tamil (`ta`), Telugu (`te`), Kannada (`kn`), and Malayalam (`ml`).
  * **Zero Voice Overlap Architecture**: Browser speech synthesis failover is completely eliminated. Active session concurrency guards (`activeSessionId`), `AbortController` network termination, and audio lifecycle teardown ensure that only **one** clean, natural Gnani voice can play at any millisecond.
  * In-memory SHA-256 prompt caching optimizing upstream API credit consumption.
* **Verbal Assessment Transcription (Gnani Prisma v2.5)**:
  * Backend REST pipeline (`POST /api/v1/voice/transcribe`) transmitting patient verbal recordings to Gnani Prisma REST v3 with language-specific numeral formatting and confidence scores.
* **Hospital Dual-Portal Architecture (Role-Separated)**:
  * **Patient Portal (`/patient`)**: Patient-facing platform experience designed for elderly users and people with low digital literacy, accessible from any browser. A first-run path through registration, language, the screening battery and a completion slip is described below as a **guided first-run journey**; the portal itself has around thirty further screens (history, trends, change, context, prevention, appointments, cognitive activities) reachable from its own navigation, not a fixed nine-screen sequence:
    * **Step 1 (Screen 1 — Welcome Page `/patient`)**: Minimal, spacious homepage with Neulens branding and two large touch targets: "New Patient" and "Existing Patient".
    * **Step 2 (Screen 2 — Registration `/patient/register` & Screen 3 — Login `/patient/login`)**: Simple registration with essential demographics issuing a collision-resistant Patient ID (`CV-2026-XXXXXX`), or 2-field login with Patient ID + PIN (the PIN is the only accepted factor; the fictional jury demo account is listed under [Jury demo access](#jury-demo-access)). A new account lands on its own dashboard (`/patient/dashboard`) — the same destination as signing in — where starting the assessment is an explicit choice rather than an automatic redirect.
    * **Step 3 (Screen 4 — Language Selection `/patient/language`)**: High-contrast regional language selection (Arabic — right-to-left, English, Tamil, Hindi, Telugu, Kannada, Malayalam) with native script and, where a reviewed voice exists, spoken audio previews powered by Gnani Timbre TTS. Arabic is offered with full RTL layout and Arabic-script fonts for navigation, consent, check-in and results, and the verbal recall stimulus is Arabic. Each entry shows its real status from `GET /api/v1/language-readiness` — English is task-ready, other languages read "wording under review" with the pending stages listed — and continuing in one requires an explicit acknowledgement that travels with the session (`taskResponses.languageReadiness`) and appears in the clinician's evidence/limitations. `POST /patient/assessment` refuses an unacknowledged non-ready language with `422 LANGUAGE_NOT_VALIDATED`. It is a guided option before a first assessment, not a forced step: language is also set in My profile and Account settings.
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

## 2. System Architecture & Design

### Architecture Style
Neulens follows a **Decoupled Client-Server Architecture with Client-Side Edge Inference and Dedicated AI Speech Gateways**:

1. **Client Tier (Presentation & Edge AI)**: A high-performance Single Page Application (SPA) executing video and acoustic telemetry processing on the user's hardware via WebAssembly and WebGL shaders. Selected signals are processed locally where supported. Raw media is not recorded or uploaded; only derived measurements are forwarded to the backend.
2. **Backend Tier (Application & AI Speech Proxy)**: A stateless Express REST API handling authentication, profile management, screening persistence, longitudinal analytics, and secure server-to-server Gnani AI speech orchestration.
3. **Data Tier (Relational & Cache/Memory)**: Prisma ORM interfacing with PostgreSQL for long-term clinical data storage, with dynamic runtime fallback to in-memory transactional collections if the database is unreachable.

### Privacy by Design

```mermaid
flowchart TD
    A[Raw video/audio] --> B[Local processing]
    B --> C[Derived features]
    C --> D[Clinician-facing output]
```

Video and audio signals are processed on the device. Raw media is not recorded or uploaded; only derived measurements are forwarded to the backend for clinical review.

---

### High-Level Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient / Clinician
    participant UI as React 18 SPA (Vite)
    participant Edge as Edge Vision & Audio (MediaPipe + FFT)
    participant VoiceEngine as Pure Gnani Voice Service
    participant API as Express 4 REST API
    participant Gnani as Gnani AI Cloud (api.vachana.ai)
    participant DB as Prisma / PostgreSQL

    Patient->>UI: Selects Language & Starts Screening Battery
    UI->>VoiceEngine: speak(instructionText, lang)
    VoiceEngine->>API: POST /api/v1/voice/synthesize
    API->>Gnani: POST /api/v1/tts/inference (Timbre v2.5)
    Gnani-->>API: 24kHz Linear PCM WAV Audio
    API-->>VoiceEngine: Binary Audio Stream (with SHA-256 Cache)
    VoiceEngine->>Patient: Plays Pure Spoken Audio via HTMLAudio

    Patient->>Edge: Repeats Sentence in Task 3 (Vocal Echo)
    Edge->>Edge: Real-time FFT: F0, Jitter %, Shimmer %, Pauses
    Edge->>API: POST /api/v1/voice/transcribe (Audio Blob)
    API->>Gnani: POST /stt/v3 (Prisma v2.5)
    Gnani-->>API: { transcript, language, confidence }
    API-->>UI: Real-Time Transcript Display

    Patient->>UI: Completes All 5 Assessment Tasks
    UI->>API: POST /api/v1/screenings (Aggregated Telemetry)
    API->>DB: Stores Assessment, EyeMetrics, VoiceMetrics, FaceMetrics
    DB-->>API: Saved Record Confirmation
    API-->>UI: Returns exploratory prototype score and screening observations
```

---

### System Architecture Diagram

```
+--------------------------------------------------------------------------------------------------+
|                                    CLIENT APPLICATION (BROWSER)                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   +----------------------------------------------------+   +---------------------------------+   |
|   |            EDGE BIOMETRIC PIPELINES                |   |        PURE GNANI VOICE SERVICE |   |
|   |  - MediaPipe Tasks Vision (478 Landmarks)          |   |  - GnaniTTSService (Exclusive)  |   |
|   |  - Ocular Saccades, Gaze Quadrant & Blink EAR      |   |  - AbortController Cancellation |   |
|   |  - Facial Symmetry, Head Pose (Yaw/Pitch/Roll)     |   |  - activeSessionId Guards       |   |
|   |  - Web Audio API FFT (F0, Jitter %, Shimmer %)     |   |  - HTMLAudioElement Lifecycle   |   |
|   +----------------------------------------------------+   +----------------+----------------+   |
|                                                                             |                    |
|   +--------------------------------------------------------------------+    |                    |
|   |                     REACT 18 & ZUSTAND UI LAYER                    |    |                    |
|   |  - Patient/Doctor portal screens          - ScreeningPage (5 Tasks)|    |                    |
|   |  - SensorCheckStage                       - ElderlyLanguageSelector|    |                    |
|   |  - ResultVoiceExplainer                   - ReportPage (PDF Export)|    |                    |
|   +--------------------------------------------------------------------+----+                    |
|                                                                        |                         |
+------------------------------------------------------------------------|-------------------------+
                                                                         | HTTPS / REST JSON / Multipart
                                                                         v
+--------------------------------------------------------------------------------------------------+
|                                  BACKEND API SERVER (EXPRESS / NODE)                             |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   +------------------------------------+          +------------------------------------------+   |
|   |           CORE MIDDLEWARE          |          |               API ROUTERS                |   |
|   |  - CORS Security Policy            |--------->|  - /api/v1/auth                          |   |
|   |  - Express JSON Body Parser        |          |  - /api/v1/screenings                    |   |
|   |  - Multer In-Memory Audio Storage  |          |  - /api/v1/analytics                     |   |
|   |  - Centralized Error Handler       |          |  - /api/v1/voice                         |   |
|   +------------------------------------+          +--------------------+---------------------+   |
|                                                                        |                         |
|   +------------------------------------+                               v                         |
|   |    GNANI AI INTEGRATION SERVICES   |          +--------------------+---------------------+   |
|   |  - GnaniTtsService (Timbre v2.5)   |          |              DATA ACCESS                 |   |
|   |    (SHA-256 In-Memory Cache)       |          |  - Prisma Client ORM Singleton           |   |
|   |  - GnaniSttService (Prisma v2.5)   |          |  - In-Memory Resilient Fallback Store    |   |
|   |  - GnaniEvonService (Evon 30B)     |          |    (Auto-engages if DB is offline)       |   |
|   +------------------+-----------------+          +--------------------+---------------------+   |
|                      |                                                 |                         |
+----------------------|-------------------------------------------------|-------------------------+
                       |                                                 |
                       | HTTPS (X-API-Key-ID)                            | TCP / SSL (Port 5432)
                       v                                                 v
+-----------------------------------------------+ +------------------------------------------------+
|       GNANI AI CLOUD (api.vachana.ai)         | |            PERSISTENCE (POSTGRESQL)            |
+-----------------------------------------------+ +------------------------------------------------+
| - Timbre v2.5: /api/v1/tts/inference (WAV)    | | - Users Table            - EyeMetrics Table    |
| - Prisma v2.5: /stt/v3 (Multipart STT)        | | - Assessments Table      - VoiceMetrics Table  |
| - Evon 30B: Optional Clinician Reasoning Gateway | - Reports Table          - FaceMetrics Table   |
+-----------------------------------------------+ +------------------------------------------------+
```

---

## 3. Project Directory Structure

```
Neulens/
├── .gitignore                          # Root Git ignore rules (node_modules, dist, envs)
├── README.md                           # Exhaustive architectural and operational documentation
│
├── client/                             # Frontend React 18 + Vite Application
│   ├── dist/                           # Production optimized build output
│   ├── index.html                      # Single-page HTML shell with font preconnects
│   ├── package.json                    # Client dependencies, scripts, and engine metadata
│   ├── postcss.config.js               # PostCSS pipeline configuration (Tailwind, Autoprefixer)
│   ├── tailwind.config.js              # Custom Tailwind configuration (medical blues, card shadows)
│   ├── tsconfig.json                   # TypeScript project compiler options and path aliases
│   ├── tsconfig.node.json              # TypeScript compilation rules for Vite node plugins
│   ├── vite.config.ts                  # Vite server config, port 5173, path aliases, proxy rules
│   │
│   └── src/                            # Application Source Code
│       ├── main.tsx                    # React DOM root entry point
│       ├── App.tsx                     # Top-level router provider integration
│       │
│       ├── components/                 # Presentation & Voice UI Components
│       │   └── voice/                  # Multimodal Voice Assistant Components
│       │       ├── ElderlyLanguageSelector.tsx  # High-contrast, large-font initial language selector
│       │       ├── LanguageSelectorModal.tsx    # Modal dialog for changing language mid-session
│       │       ├── ResultVoiceExplainer.tsx     # Pure Gnani readout component for screening results
│       │       ├── SensorCheckStage.tsx         # Hardware validation check (camera alignment & mic level)
│       │       ├── SpokenInstructionBanner.tsx  # Large, readable visual cue banner for seniors
│       │       └── VoiceAssistantAvatar.tsx     # Floating assistant avatar with dynamic status rings
│       │
│       ├── features/                   # Feature-Driven Page Views & Subsystems
│       │   ├── patient/                         # Patient Portal Experience
│       │   │   ├── PatientHubPage.tsx           # Portal home (Register / Existing sign-in)
│       │   │   ├── PatientRegisterPage.tsx      # Portal registration with instant CV-2026 ID generation
│       │   │   ├── PatientLoginPage.tsx         # Quick check-in via Patient ID + PIN/birth year
│       │   │   ├── PatientAssessmentPage.tsx    # Age-adaptive distraction-free battery container
│       │   │   └── PatientCompletionPage.tsx    # Privacy-isolated exit screen with printable ID card
│       │   ├── doctor/                          # Doctor / Clinician Workspace
│       │   │   ├── DoctorLoginPage.tsx          # Clinician authentication with 1-click evaluation access
│       │   │   ├── DoctorDashboardPage.tsx      # Real database KPI metrics & recent assessments queue
│       │   │   ├── DoctorPatientsPage.tsx       # Searchable patient directory with review-state filter
│       │   │   ├── DoctorPatientProfilePage.tsx # Complete medical file & task-by-task recorded responses
│       │   │   └── DoctorReportViewPage.tsx     # Hospital clinical report, radar chart, notes & PDF export
│       │   ├── about/
│       │   │   └── AboutPage.tsx                # Technology architecture and platform clinical overview
│       │   ├── assessments/
│       │   │   └── AssessmentsPage.tsx          # Battery protocol catalog & micro-test selector
│       │   ├── auth/                            # Authentication & Onboarding
│       │   │   ├── ForgotPasswordPage.tsx       # Password recovery interface
│       │   │   ├── LoginPage.tsx                # Clinician/Patient credentials authentication (1-click demo)
│       │   │   ├── ProfileSetupPage.tsx         # 4-Step demographic & medical history onboarding
│       │   │   └── RegisterPage.tsx             # New user profile registration form
│       │   ├── landing/
│       │   │   └── LandingPage.tsx              # Public hero landing, core pillars & feature showcases
│       │   ├── patients/
│       │   │   └── PatientsPage.tsx              # Patient directory with review filter tabs & modal
│       │   ├── recommendations/
│       │   │   └── RecommendationsPage.tsx      # Neurologist referral network & lifestyle pathways
│       │   ├── report/
│       │   │   └── ReportPage.tsx               # Printable clinical report, radar chart & doctor share
│       │   ├── results/
│       │   │   └── ResultsPage.tsx              # Post-screening score breakdown & telemetry
│       │   ├── screening/
│       │   │   └── ScreeningPage.tsx            # 5-test interactive screening battery orchestration
│       │   └── settings/
│       │       └── SettingsPage.tsx             # Hardware calibration, accessibility, system preferences
│       │
│       ├── hooks/                      # Custom React Hooks
│       │   └── useFaceLandmarker.ts             # MediaPipe FaceLandmarker lifecycle, EAR & gaze tracking
│       │
│       ├── layouts/                    # Persistent Shell Layouts
│       │   ├── AppLayout.tsx                    # Minimal root layout for landing and patient portal
│       │   ├── DoctorLayout.tsx                 # Persistent clinician sidebar navigation & top header
│       │   └── DashboardLayout.tsx              # Legacy clinician dashboard layout
│       │
│       ├── routes/                     # Application Routing
│       │   └── index.tsx                        # Router definitions with Public/Protected route guards
│       │
│       ├── services/                   # Frontend Services
│       │   ├── language/                        # Localization & Regional Translations
│       │   │   ├── LanguageManager.ts           # Language store & catalog
│       │   │   ├── translations/                # Dictionaries: en, hi, ta, te, kn, ml
│       │   │   └── types.ts                     # Language types & translation schemas
│       │   └── voice/                           # Voice Services
│       │       ├── gnaniVoiceApi.ts             # Typed HTTP client to backend /api/v1/voice
│       │       ├── SpeechRecognitionService.ts  # Prisma STT clip transcription & keyword listener
│       │       ├── TextToSpeechService.ts       # Pure Gnani Timbre v2.5 TTS (Zero Overlap Engine)
│       │       ├── VoiceInstructionEngine.ts    # Voice assistant orchestration store
│       │       └── types.ts                     # Voice options, status, and interface definitions
│       │
│       ├── store/                      # Zustand State Stores
│       │   ├── authStore.ts                     # Session authentication & pre-seeded demo clinician
│       │   ├── faceTrackingStore.ts             # Real-time computer vision metrics (60 FPS)
│       │   └── screeningStore.ts                # Multi-task scoring engine and prototype score
│       │
│       └── styles/
│           └── index.css                        # Global CSS, Tailwind utilities, and animations
│
└── server/                             # Backend Node.js / Express Application
    ├── dist/                           # Compiled JavaScript output
    ├── package.json                    # Backend dependencies, scripts, and engine metadata
    ├── tsconfig.json                   # Backend TypeScript compiler configuration
    │
    ├── prisma/                         # Database Schema & Migrations
    │   ├── schema.prisma               # Prisma data models (Users, Assessments, Metrics, Reports)
    │   └── migrations/                 # PostgreSQL relational migration history
    │
    └── src/                            # Server Source Code
        ├── app.ts                      # Express app setup, CORS, dotenv/config, route mount
        │
        ├── controllers/                # Request Handlers
        │   ├── patient.controller.ts   # Portal register, login, session, assessment submit
        │   ├── doctor.controller.ts    # Clinician login, dashboard KPIs, patients, report reviews
        │   ├── analytics.controller.ts # Longitudinal trend computation
        │   ├── auth.controller.ts      # User registration, login, profile updates
        │   ├── screening.controller.ts # Assessment submission, history retrieval
        │   └── voice.controller.ts     # Gnani STT/TTS proxy, caching, rate limiting
        │
        ├── middleware/                 # Express Request Interceptors
        │   ├── auth.ts                 # JWT Bearer token authentication & role verification
        │   └── errorHandler.ts         # Centralized error routing & status serialization
        │
        ├── routes/                     # API Route Definitions
        │   ├── patient.routes.ts       # Routes for /api/v1/patient
        │   ├── doctor.routes.ts        # Routes for /api/v1/doctor
        │   ├── analytics.routes.ts     # Routes for /api/v1/analytics
        │   ├── auth.routes.ts          # Routes for /api/v1/auth
        │   ├── index.ts                # Master router aggregator & /api/v1/health check
        │   ├── screening.routes.ts     # Routes for /api/v1/screenings
        │   └── voice.routes.ts         # Multer upload & routes for /api/v1/voice
        │
        ├── services/                   # Backend Business Logic & AI Gateways
        │   └── gnani/                  # Gnani AI Speech Integration
        │       ├── evon.service.ts     # Evon 30B reasoning model gateway
        │       ├── gnaniStt.service.ts # Prisma v2.5 STT REST client
        │       ├── gnaniTts.service.ts # Timbre v2.5 TTS client with SHA-256 LRU cache
        │       └── types.ts            # Voice catalog, BCP-47 mappings, options
        │
        ├── tests/                      # Automated Integration Test Suite
        │   ├── portalIntegration.test.ts # 8 tests: patient ID, registration, triage, doctor reviews
        │   └── voiceIntegration.test.ts  # 17 tests: catalog, Timbre TTS, Prisma STT, Evon
        │
        └── validation/
            ├── schemas.ts              # Zod validation schemas for core endpoints
            └── voice.schemas.ts        # Zod validation schemas for /voice endpoints
```

---

## 4. Deep Dive: Core Components & Modules

### Frontend / User Interface Subsystems

#### 1. Routing & Route Security (`client/src/routes/index.tsx`)
The routing architecture is constructed using React Router v6 (`createBrowserRouter`). Security is enforced through modular route guard components:
* `PublicRoute`: Restricts authenticated sessions from accessing landing or login pages, redirecting active users directly to `/dashboard`.
* `ProtectedRoute`: Evaluates JWT presence and profile completeness. Pre-seeds the `clinician:create` source-data script so a judge can provision a clinician account with one command; the shipped UI does not embed any clinician credentials.
* `ProfileSetupRoute`: Prevents users with completed onboarding profiles from re-submitting baseline demographics.

#### 2. Centralized State Stores (Zustand)
* **`screeningStore.ts`**: Coordinates the multi-stage assessment state machine (`currentStep`), stores raw game performance parameters, and runs `calculateFinalScores()` to derive weighted composite indices and standard cognitive domain mappings.
* **`faceTrackingStore.ts`**: Maintains high-frequency computer vision telemetry (60 FPS) including iris coordinates, Eye Aspect Ratio (EAR), gaze quadrants, blink counter, 3D head pose (yaw/pitch/roll), facial stability standard deviations, and smile/jaw/eyebrow expression percentages.
* **`VoiceInstructionEngine.ts`**: Implements the audio assistant state machine (`idle`, `speaking`, `listening`, `warning`, `transcribing`), subtitle rendering, contextual cue throttling (preventing prompt spamming via 12-second cooldowns), and voice-control keyword listener.
* **`authStore.ts`**: Encapsulates user session tokens, user entity data, and persistent browser storage syncing (`localStorage`).
* **`LanguageManager.ts`**: Houses active language state, native script labels, BCP-47 locale identifiers, and localized spoken translation dictionaries across the supported languages.

---

### Backend API & Services Architecture

#### 1. Modular Controller Layer
* **`auth.controller.ts`**: Manages credential hashing (`bcryptjs` salt rounds: 10), JSON Web Token signing (`7d` session lifespan), profile mutation, and password reset token generation. Integrates dual-write/read logic with automated in-memory fallback.
* **`screening.controller.ts`**: Ingests compound screening submissions. Unpacks nested records to atomically generate `Assessment`, `EyeMetrics`, `VoiceMetrics`, `FaceMetrics`, and `Report` tables within PostgreSQL transactions.
* **`analytics.controller.ts`**: Aggregates longitudinal screening results, transforming time-series metrics into coordinate arrays ready for Recharts rendering (`overallScore`, `reactionTime`, `symmetry`). Missing values are returned as `null`, never as `0`. Acoustic jitter and shimmer are deliberately excluded: they are microphone- and codec-sensitive quality features, not cognitive evidence.
* **`voice.controller.ts`**: Orchestrates Gnani AI Timbre v2.5 synthesis and Prisma v2.5 transcription. Features sliding-window rate limiting (45 TTS req/min, 20 STT req/min) to preserve paid API credits, payload sanitization, and error normalization.

#### 2. Inbound Validation & Serialization (`server/src/validation/`)
All inbound requests undergo strict runtime schema validation via Zod before reaching controller logic:
```typescript
export const synthesizeBodySchema = z.object({
  text: z.string().min(1, 'Text cannot be empty').max(2500, 'Text exceeds 2,500 characters'),
  language: z.string().min(2).max(10),
  voice: z.string().optional(),
  speed: z.number().min(0.5).max(2.0).optional().default(0.95),
  sampleRate: z.number().int().optional().default(24000)
});
```

#### 3. Error Handling Middleware (`server/src/middleware/errorHandler.ts`)
Catches uncaught exceptions and Zod schema validation errors, returning structured RFC-7807 compliant error envelopes:
```json
{
  "error": "Validation error",
  "details": [
    { "field": "overallScore", "message": "Expected number, received string" }
  ]
}
```

---

### Business Logic & Processing Pipelines

#### 1. Ocular Processing Pipeline (`useFaceLandmarker.ts`)
* **Eye Aspect Ratio (EAR)**: Computed from landmark vertical distances divided by horizontal eye width:
  $$\text{EAR} = \frac{\|\mathbf{p}_{385} - \mathbf{p}_{380}\| + \|\mathbf{p}_{386} - \mathbf{p}_{374}\|}{2 \cdot \|\mathbf{p}_{362} - \mathbf{p}_{263}\|}$$
* **Blink State Machine**: Evaluates EAR against a dynamic threshold ($0.20$) combined with MediaPipe blendshapes (`eyeBlinkLeft`, `eyeBlinkRight`). Includes a 200ms debounce cooldown to eliminate false-positive flutter.
* **Gaze Estimation**: Computes horizontal and vertical iris center displacement relative to the inner and outer canthi of each eye. Ratios categorize gaze into `Center`, `Left`, `Right`, `Up`, or `Down`, and project normalized $X/Y$ coordinates to the screen.
* **Fixation Stability**: Monitors iris coordinate Euclidean drift over sliding time windows; if drift remains $< 0.015$ units, fixation duration increments continuously.

#### 2. Acoustic Voice Analysis Pipeline (`ScreeningPage.tsx`)
* **Audio Capture**: Employs Web Audio API `AudioContext` connected via `createMediaStreamSource` to an `AnalyserNode` configured with an FFT size of $128$.
* **Waveform Animation**: Continuously queries `analyser.getByteTimeDomainData` to draw a live acoustic waveform onto a dynamic canvas overlay.
* **Acoustic feature synthesis**: Derives vocal metrics during phrase repetition:
  * *Fundamental Frequency ($F_0$)*: Extracted via auto-correlation pitch detection (normal adult range: 85–255 Hz).
  * *Acoustic Jitter*: Period-to-period perturbation in pitch frequency.
  * *Acoustic Shimmer*: Period-to-period variability in peak waveform amplitude.
  * *Speech Pause Cadence*: Detection of sub-threshold energy troughs ($> 250\text{ ms}$) counting hesitations.
  * **Scope limit, stated deliberately**: jitter and shimmer are measured through a laptop or phone microphone and are dominated by microphone response, codec, room noise and browser resampling — not by laryngeal status and certainly not by cognition. They are retained as **acoustic quality and engagement signals only**. They never contribute to a domain score, the composite, a review prompt, or any change comparison, and the patient-facing API excludes them entirely. No claim about cognition, pathology or diagnosis is made from them.

#### 3. Pure Gnani AI Speech & Zero Overlap Architecture
To eliminate robotic speech and prevent overlapping voices during screening:
* **Browser Failover Completely Removed**: `window.speechSynthesis` and `SpeechSynthesisUtterance` are entirely absent from the speech pipeline. All prompts are delivered via Gnani Timbre v2.5.
* **Active Session Concurrency Isolation**: `TextToSpeechService` assigns each `speak()` request a unique `activeSessionId`. When a new instruction is issued or `stop()` is triggered, any pending network download or playback callback that does not match the active session ID is dropped before audio can play.
* **Immediate HTTP Abort**: Incorporates `AbortController`. Triggering a new spoken cue immediately aborts the active fetch to `/api/v1/voice/synthesize`.
* **Resource Disposal**: Active `HTMLAudioElement` instances have their `src` removed, listeners detached, and object URLs revoked immediately upon interruption.

#### 4. Cognitive Domain Scoring Engine (`screeningStore.ts`)
Raw test metrics are mapped into four classical neuropsychological domains:
* **Memory Recall ($M$)**: Derived from Task 2 (Cortex Match) spatial-pair retention and error rates.
* **Attention & Processing ($A$)**: Weighted mean of Task 1 (Focus Orbit saccades) and Task 4 (Mimic Sync kinematic responsiveness).
* **Visuospatial Orientation ($V$)**: Derived from Task 5 (Path Mapper) trail connection accuracy.
* **Executive Function ($E$)**: Composite of Task 5 trail sequencing latency and Task 2 decision speed.
* **Exploratory Prototype Score**:
  $$\text{Prototype Score} = \frac{M + A + V + E}{4}$$
  * The composite and component scores are experimental implementation outputs. They have no validated population norms, clinical cutoffs, or evidence-based follow-up intervals.
  * Scores must not be interpreted as disease risk, normative performance, or a recommendation for specialist referral. Longitudinal change cues are separate workflow prompts for qualified clinician review.

---

## 5. Models & Data Architecture (Top-to-Bottom)

### Database Schema (PostgreSQL via Prisma ORM)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id             String       @id @default(uuid())
  patientId      String?      @unique // Unique Hospital ID e.g. CV-2026-XXXXXX
  role           String       @default("PATIENT") // PATIENT | CLINICIAN | ADMIN
  name           String
  email          String       @unique
  passwordHash   String
  age            Int
  dob            String?      // Birth year or date of birth e.g. 1954
  pin            String?      // Optional 4-digit portal verification PIN
  gender         String       // MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
  language       String       // en, ta, hi, te, kn, ml
  educationYears Int?         // Formal education in years
  handedness     String?      // RIGHT, LEFT, AMBIDEXTROUS
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  assessments    Assessment[]
}

model Assessment {
  id           String        @id @default(uuid())
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  date         DateTime      @default(now())
  overallScore Float?        // null when the session produced no interpretable score
  reviewState  String        // NOT_REVIEWED | NOT_INTERPRETABLE | REVIEW_PROMPT | CLINICIAN_REVIEWED
  status       String        @default("COMPLETED") // IN_PROGRESS | COMPLETED | ABORTED
  reviewStatus String        @default("PENDING_REVIEW") // PENDING_REVIEW | REVIEWED | FOLLOWUP_REQUIRED
  reviewedBy   String?       // Clinician identifier/name
  reviewedAt   DateTime?     // Verification timestamp
  taskResponses Json?        // Granular recorded responses across all 5 battery tasks
  
  eyeMetrics   EyeMetrics?
  voiceMetrics VoiceMetrics?
  faceMetrics  FaceMetrics?
  report       Report?
}

model EyeMetrics {
  id            String     @id @default(uuid())
  assessmentId  String     @unique
  assessment    Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  reactionTime  Float      // milliseconds
  blinkRate     Float      // blinks per minute
  fixationScore Float      // percentage (0 - 100)
}

model VoiceMetrics {
  id           String     @id @default(uuid())
  assessmentId String     @unique
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  speechRate   Float      // words per minute (WPM)
  pauseScore   Float      // hesitation index (0 - 100)
  jitter       Float      // frequency perturbation percentage
  shimmer      Float      // amplitude perturbation percentage
}

model FaceMetrics {
  id           String     @id @default(uuid())
  assessmentId String     @unique
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  symmetry     Float      // bilateral facial symmetry (0 - 100)
  tremorScore  Float      // involuntary micro-tremor amplitude
}

model Report {
  id             String     @id @default(uuid())
  assessmentId   String     @unique
  assessment     Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  recommendation String     @db.Text
  doctorNotes    String?    @db.Text
  pdfUrl         String?
}
```

---

### Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Assessment : "undergoes"
    Assessment ||--o| EyeMetrics : "records"
    Assessment ||--o| VoiceMetrics : "records"
    Assessment ||--o| FaceMetrics : "records"
    Assessment ||--o| Report : "generates"

    User {
        String id PK "UUID"
        String name
        String email UK
        String passwordHash
        Int age
        String gender
        String language
        DateTime createdAt
        DateTime updatedAt
    }

    Assessment {
        String id PK "UUID"
        String userId FK
        DateTime date
        Float overallScore "nullable"
        String reviewState
    }

    EyeMetrics {
        String id PK "UUID"
        String assessmentId FK, UK
        Float reactionTime
        Float blinkRate
        Float fixationScore
    }

    VoiceMetrics {
        String id PK "UUID"
        String assessmentId FK, UK
        Float speechRate
        Float pauseScore
        Float jitter
        Float shimmer
    }

    FaceMetrics {
        String id PK "UUID"
        String assessmentId FK, UK
        Float symmetry
        Float tremorScore
    }

    Report {
        String id PK "UUID"
        String assessmentId FK, UK
        String recommendation
        String doctorNotes
        String pdfUrl
    }
```

---

### AI / ML & Speech Models Architecture

#### 1. MediaPipe FaceLandmarker Task
* **Architecture**: Deep convolutional multi-stage pipeline utilizing BlazeFace for face detection followed by a 3D mesh regression network predicting 478 3D metric landmarks (468 standard mesh vertices + 10 iris boundary vertices).
* **Model Asset**: `face_landmarker.task` (Float16 precision, GPU delegate enabled).
* **Delivery & CDN**: Dynamic runtime retrieval via `@mediapipe/tasks-vision` Wasm binary resolver (`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm`).
* **Input Pipeline**: Video frame buffers ($640 \times 480$ resolution) acquired via `navigator.mediaDevices.getUserMedia`, passed directly to `detectForVideo(videoElement, timestampMs)` inside `requestAnimationFrame`.
* **Output Processing**:
  * 478 3D Normalized Landmark coordinates ($x, y, z \in [0, 1]$).
  * 52 Facial Blendshape classification scores evaluating specific muscle groups (`mouthSmileLeft`, `mouthSmileRight`, `jawOpen`, `browOuterUpLeft`, `browOuterUpRight`, `browInnerUp`).

#### 2. Gnani AI Timbre v2.5 (Text-to-Speech)
* **Model ID**: `timbre-v2.5`
* **Upstream Endpoint**: `POST https://api.vachana.ai/api/v1/tts/inference`
* **Audio Format**: 24kHz linear PCM, container: WAV, mono channel.
* **Authentication**: Header `X-API-Key-ID: <GNANI_API_KEY>` kept strictly on the backend.
* **Verified Voice Catalog**:
  * Tamil (`ta` / `ta-IN`): **Asmita** (Default), Trisha, Brinda, Vedika, Noopur
  * Hindi (`hi` / `hi-IN`): **Nalini** (Default), Deepak, Poorvi
  * English (`en` / `en-IN`): **Kaveri** (Default), Yashvi, Arjun
  * Telugu (`te` / `te-IN`): **Suhana** (Default), Lehara, Lavanya, Yukti, Varuni
  * Kannada (`kn` / `kn-IN`): **Saanvi** (Default), Kavin
  * Malayalam (`ml` / `ml-IN`): **Reshma** (Default), Riyaan
* **Optimization & Caching**: SHA-256 hash indexing over `(lang + voice + speed + text)` with in-memory LRU caching to preserve the 5,000 credit budget for static screening instructions.

#### 3. Gnani AI Prisma v2.5 (Speech-to-Text)
* **Model ID**: `gnani-prisma-v2.5` (Prisma v3 REST)
* **Upstream Endpoint**: `POST https://api.vachana.ai/stt/v3`
* **Payload Structure**: Multipart form-data with fields `audio_file`, `language_code`, `preferred_language`, `format: "transcribe"`, `itn_native_numerals: "true"`.
* **Safety Boundaries**: Upper limits of 15MB and 60 seconds per verbal task response.

#### 4. Gnani Evon 30B (Optional Clinician Reasoning Model)
* **Model ID**: `gnani/gnani-evon-v3.3-30B-A3B` (Hugging Face)
* **Architecture**: Hybrid Mamba-Transformer Mixture-of-Experts (30B total parameters, ~3.5B active per token).
* **Role**: Optional clinician synthesis assistant. External calls stay disabled unless both `EVON_INFERENCE_URL` and `EVON_DATA_PROCESSING_APPROVED=true` are set; numeric scores only (no age, IDs or transcripts), and output is a review draft. The recommended path is the local FastAPI `/v1/ai/explanation` endpoint documented in [`docs/ai-report-generation.md`](docs/ai-report-generation.md).

---

## 6. Environment Setup & Configuration

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

## 7. Installation & Local Development

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

## 8. Deployment & Production Guide

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

## 9. API Reference / Core Endpoints

Base URL: `http://localhost:5000/api/v1` (or relative `/api/v1` via Vite proxy).

### System & Health

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | Service liveness probe. Returns HTTP 200 and server timestamp. |

---

### Authentication (`/auth`)

#### 1. Register User
* **Endpoint**: `POST /auth/register`
* **Auth**: None
* **Request Payload**:
```json
{
  "email": "dr.sharma@hospital.org",
  "password": "SecurePassword123!",
  "name": "Dr. Sarah Sharma",
  "age": 42,
  "gender": "FEMALE",
  "language": "ENGLISH"
}
```
* **Response (`201 Created`)**:
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "c3e981ad-e612-4e44-bca5-b289cf422d14",
    "email": "dr.sharma@hospital.org",
    "name": "Dr. Sarah Sharma",
    "age": 42,
    "gender": "FEMALE",
    "language": "ENGLISH",
    "createdAt": "2026-10-24T15:30:00.000Z"
  }
}
```

#### 2. Login User
* **Endpoint**: `POST /auth/login`
* **Auth**: None
* **Request Payload**:
```json
{
  "email": "dr.sharma@hospital.org",
  "password": "SecurePassword123!"
}
```
* **Response (`200 OK`)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "c3e981ad-e612-4e44-bca5-b289cf422d14",
    "email": "dr.sharma@hospital.org",
    "name": "Dr. Sarah Sharma"
  }
}
```

#### 3. Get Authenticated User Profile
* **Endpoint**: `GET /auth/me`
* **Auth**: `Bearer <token>`
* **Response (`200 OK`)**:
```json
{
  "user": {
    "id": "c3e981ad-e612-4e44-bca5-b289cf422d14",
    "email": "dr.sharma@hospital.org",
    "name": "Dr. Sarah Sharma",
    "age": 42,
    "gender": "FEMALE",
    "language": "ENGLISH"
  }
}
```

#### 4. Update Profile Demographics
* **Endpoint**: `PUT /auth/profile`
* **Auth**: `Bearer <token>`
* **Request Payload**:
```json
{
  "age": 43,
  "gender": "FEMALE",
  "language": "ENGLISH"
}
```
* **Response (`200 OK`)**:
```json
{
  "message": "Profile updated successfully",
  "user": { "id": "...", "age": 43, "gender": "FEMALE", "language": "ENGLISH" }
}
```

#### 5. Forgot Password Recovery
* **Endpoint**: `POST /auth/forgot-password`
* **Auth**: None
* **Request Payload**:
```json
{
  "email": "dr.sharma@hospital.org"
}
```
* **Response (`200 OK`)**:
```json
{
  "message": "If the email exists, a password reset link has been dispatched.",
  "debugResetLink": "http://localhost:5173/auth/reset-password?token=..."
}
```

---

### Patient Portal Endpoints (`/api/v1/patient`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/patient/register` | None | Patient portal registration. Generates collision-resistant Patient ID (`CV-2026-XXXXXX`). |
| `POST` | `/patient/login` | None | Patient portal authentication using Patient ID + PIN or birth year verification. |
| `GET` | `/patient/session` | `Bearer <token>` | Returns authenticated patient identity & assigned battery. |
| `POST` | `/patient/assessment` | `Bearer <token>` | The only assessment submission entry point. Score is derived server-side from `taskResponses`; returns the session record and clinician-review workflow state. |
| `GET` | `/patient/confirmation-card` | `Bearer <token>` | Downloads/prints patient ID confirmation slip with check-in timestamp. |

---

### Doctor Portal Endpoints (`/api/v1/doctor`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/doctor/login` | None | Clinician credentials authentication (1-click evaluation access available). |
| `GET` | `/doctor/dashboard` | `Bearer <token>` (Clinician) | Real-time database metrics: total patients, today's screenings, pending reviews, recent queue. |
| `GET` | `/doctor/patients` | `Bearer <token>` (Clinician) | Searchable patient directory by Patient ID or name, with risk filter (`ALL`, `LOW`, `MODERATE`, `HIGH`). |
| `GET` | `/doctor/patients/:id` | `Bearer <token>` (Clinician) | Complete clinical patient dossier with task-by-task recorded responses and longitudinal history. |
| `GET` | `/doctor/reports/:id` | `Bearer <token>` (Clinician) | Official clinical screening report with domain radar chart, AI interpretation, and review notes. |
| `PATCH` | `/doctor/reports/:id/review` | `Bearer <token>` (Clinician) | Updates review status (`PENDING_REVIEW`, `REVIEWED`, `FOLLOWUP_REQUIRED`) and signs neurologist notes. |

---

### Screenings (`/screenings`)

#### 1. Submit Screening Assessment
* **Endpoint**: `POST /screenings`
* **Auth**: `Bearer <token>`
* **Request Payload**:
```json
{
  "taskResponses": {
    "game1": { "score": 88 },
    "game2": { "score": 82 },
    "game3": { "score": 90 },
    "game4": { "score": 84 },
    "game5": { "score": 78 },
    "pianoSequence": { "score": 85 }
  },
  "reactionTime": 248.2,
  "blinkRate": 14.0,
  "fixationScore": 92.4,
  "speechRate": 142.0,
  "pauseScore": 88.0,
  "jitter": 0.11,
  "shimmer": 1.15,
  "symmetry": 95.8,
  "tremorScore": 8.4,
  "recommendation": "Session recorded. Clinician review required.",
  "doctorNotes": "Patient cooperative, high eye-tracking fixation hold."
}
```

There is no `overallScore` field: the score is computed server-side from `taskResponses`
(`server/src/services/sessionScoring.ts`). Sending one is rejected with `400`. A session
whose tasks do not cover all four domains stores `null` and is marked `NOT_INTERPRETABLE`.
* **Response (`201 Created`)**:
```json
{
  "message": "Assessment processed successfully",
  "assessment": {
    "id": "e4f802d1-7c91-4e78-8d02-123456789abc",
    "userId": "c3e981ad-e612-4e44-bca5-b289cf422d14",
    "date": "2026-10-24T15:35:00.000Z",
    "overallScore": 84.5,
    "reviewState": "NOT_REVIEWED",
    "eyeMetrics": {
      "reactionTime": 248.2,
      "blinkRate": 14.0,
      "fixationScore": 92.4
    },
    "voiceMetrics": {
      "speechRate": 142.0,
      "pauseScore": 88.0,
      "jitter": 0.11,
      "shimmer": 1.15
    },
    "faceMetrics": {
      "symmetry": 95.8,
      "tremorScore": 8.4
    },
    "report": {
      "recommendation": "Normal neurocognitive baseline. Re-evaluate in 12 months.",
      "doctorNotes": "Patient cooperative, high eye-tracking fixation hold."
    }
  }
}
```

#### 2. Get Screening History
* **Endpoint**: `GET /screenings`
* **Auth**: `Bearer <token>`
* **Response (`200 OK`)**:
```json
{
  "history": [
    {
      "id": "e4f802d1-7c91-4e78-8d02-123456789abc",
      "date": "2026-10-24T15:35:00.000Z",
      "overallScore": 84.5,
      "reviewState": "NOT_REVIEWED",
      "eyeMetrics": { "reactionTime": 248.2, "blinkRate": 14.0, "fixationScore": 92.4 },
      "voiceMetrics": { "speechRate": 142.0, "pauseScore": 88.0, "jitter": 0.11, "shimmer": 1.15 },
      "faceMetrics": { "symmetry": 95.8, "tremorScore": 8.4 },
      "report": { "recommendation": "Normal baseline." }
    }
  ]
}
```

#### 3. Get Specific Screening by ID
* **Endpoint**: `GET /screenings/:id`
* **Auth**: `Bearer <token>`
* **Response (`200 OK`)**:
```json
{
  "assessment": {
    "id": "e4f802d1-7c91-4e78-8d02-123456789abc",
    "userId": "c3e981ad-e612-4e44-bca5-b289cf422d14",
    "date": "2026-10-24T15:35:00.000Z",
    "overallScore": 84.5,
    "reviewState": "NOT_REVIEWED",
    "eyeMetrics": { "reactionTime": 248.2, "blinkRate": 14.0, "fixationScore": 92.4 },
    "voiceMetrics": { "speechRate": 142.0, "pauseScore": 88.0, "jitter": 0.11, "shimmer": 1.15 },
    "faceMetrics": { "symmetry": 95.8, "tremorScore": 8.4 },
    "report": { "recommendation": "Normal baseline." }
  }
}
```

---

### Analytics (`/analytics`)

#### 1. Retrieve Longitudinal Screening Trends
* **Endpoint**: `GET /analytics/trends`
* **Auth**: `Bearer <token>`
* **Response (`200 OK`)**:
```json
{
  "trends": {
    "labels": ["May 12", "Jun 14", "Jul 26", "Oct 24"],
    "datasets": {
      "overall": [78.0, 81.2, 84.0, 84.5],
      "reactionTime": [290.0, 275.4, 255.0, 248.2],
      "symmetry": [91.0, 93.4, 94.0, 95.8],
      "jitter": [0.14, 0.12, 0.12, 0.11]
    },
    "rawCount": 4
  }
}
```

---

### Voice & Speech AI (`/voice`) — Gnani AI Integration

#### 1. Service Health & Capabilities
* **Endpoint**: `GET /voice/health`
* **Auth**: None
* **Description**: Returns configuration and model status without making paid external calls.
* **Response (`200 OK`)**:
```json
{
  "status": "ok",
  "configured": true,
  "message": "Gnani AI speech engines active (Prisma STT v2.5 / Timbre TTS v2.5)",
  "stt": {
    "model": "Prisma v2.5 (v3 REST)",
    "endpoint": "/api/v1/voice/transcribe",
    "supportedLanguages": ["en", "ta", "hi", "te", "ml", "kn"]
  },
  "tts": {
    "model": "Timbre v2.5",
    "endpoint": "/api/v1/voice/synthesize",
    "supportedLanguages": ["en", "ta", "hi", "te", "ml", "kn"],
    "cacheEntries": 14
  },
  "evon": {
    "model": "gnani/gnani-evon-v3.3-30B-A3B",
    "available": false,
    "reason": "Disabled. Set EVON_INFERENCE_URL and confirm EVON_DATA_PROCESSING_APPROVED=true only after a privacy/data-processing review. Prefer the local FastAPI explanation endpoint."
  }
}
```

#### 2. Verified Voice Catalog
* **Endpoint**: `GET /voice/voices`
* **Auth**: None
* **Description**: Returns supported Indian languages and verified Timbre v2.5 voice identifiers.
* **Response (`200 OK`)**:
```json
{
  "success": true,
  "languages": {
    "ta": { "languageCode": "ta", "bcp47": "ta-IN", "languageName": "Tamil", "defaultVoice": "Asmita", "availableVoices": ["Asmita", "Trisha", "Brinda", "Vedika", "Noopur"] },
    "hi": { "languageCode": "hi", "bcp47": "hi-IN", "languageName": "Hindi", "defaultVoice": "Nalini", "availableVoices": ["Nalini", "Deepak", "Poorvi"] },
    "en": { "languageCode": "en", "bcp47": "en-IN", "languageName": "English (Indian)", "defaultVoice": "Kaveri", "availableVoices": ["Kaveri", "Yashvi", "Arjun"] },
    "te": { "languageCode": "te", "bcp47": "te-IN", "languageName": "Telugu", "defaultVoice": "Suhana", "availableVoices": ["Suhana", "Lehara", "Lavanya", "Yukti", "Varuni"] },
    "kn": { "languageCode": "kn", "bcp47": "kn-IN", "languageName": "Kannada", "defaultVoice": "Saanvi", "availableVoices": ["Saanvi", "Kavin"] },
    "ml": { "languageCode": "ml", "bcp47": "ml-IN", "languageName": "Malayalam", "defaultVoice": "Reshma", "availableVoices": ["Reshma", "Riyaan"] }
  }
}
```

#### 3. Speech-to-Text Transcription (Gnani Prisma v2.5)
* **Endpoint**: `POST /voice/transcribe`
* **Auth**: None (Rate limited: 20 req/min)
* **Content-Type**: `multipart/form-data`
* **Payload Fields**:
  * `audio_file`: Audio recording binary (WAV, WebM, MP3 up to 15MB)
  * `language`: Language code (`ta`, `hi`, `en`, `te`, `kn`, `ml`, or BCP-47 tag)
  * `format`: Optional, `'transcribe'` (default) or `'detailed'`
  * `itnNativeNumerals`: Optional boolean (default: `true`)
* **Response (`200 OK`)**:
```json
{
  "success": true,
  "transcript": "Cognitive markers and visual path tracings measure baseline motor coordination",
  "language": "en-IN",
  "requestId": "req_8b9f1d0a",
  "confidence": 0.94,
  "latencyMs": 284
}
```

#### 4. Text-to-Speech Synthesis (Gnani Timbre v2.5)
* **Endpoint**: `POST /voice/synthesize`
* **Auth**: None (Rate limited: 45 req/min)
* **Content-Type**: `application/json`
* **Request Payload**:
```json
{
  "text": "வணக்கம், நான் வழிகாட்டுவேன்.",
  "language": "ta",
  "voice": "Asmita",
  "speed": 0.95
}
```
* **Response (`200 OK`)**:
  * `Content-Type`: `audio/wav`
  * `X-Gnani-Voice`: `Asmita`
  * `X-Gnani-Language`: `ta-IN`
  * `X-Gnani-Cached`: `true` | `false`
  * Body: Binary WAV audio stream (24kHz linear PCM)

#### 5. Evon 30B Clinician Synthesis (Optional Gateway)
* **Endpoint**: `POST /voice/evon-summary`
* **Auth**: Clinician or admin bearer token
* **Description**: Optional clinical documentation summarizer powered by Evon 30B. Disabled (503 with a safe reason) unless `EVON_INFERENCE_URL` is set and `EVON_DATA_PROCESSING_APPROVED=true`. Accepts numeric scores only; age, identifiers, free text and transcripts are rejected. Output is always marked as a clinician-review draft.
* **Request Payload**:
```json
{
  "testScores": {
    "memoryScore": 85,
    "attentionScore": 90,
    "visuospatialScore": 80,
    "executiveScore": 78,
    "compositeScore": 83
  },
  "language": "en"
}
```

---

## 10. License & Attribution

Developed for the **National Bio Entrepreneurship Competition (NBEC 2026)**.  
Licensed under the **MIT License**. See `LICENSE` for details.

### Reproducing this document's state

The file [`scripts/neulens-snapshot.sh`](scripts/neulens-snapshot.sh) captures the exact dependency-integrity, build, and test state behind the figures in this README. Run it in a clean checkout to confirm parity.
