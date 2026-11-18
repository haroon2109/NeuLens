# Judge Q&A

## What does Neulens actually do?

It guides a patient through a short multimodal screening and produces a structured reviewable record that a clinician opens afterward. The system records observations about memory, attention, voice, ocular, and facial behavior during the session, then presents them with quality warnings and domain observations so a clinician can review before anything is shared.

## Where is the data coming from?

Three sources, and every observation in the record says which one it came from:

1. **Measured in the session** — camera, microphone and touch during the five activities. That is the actual screening signal, it is timestamped, and it carries a quality flag so a bad capture is visible rather than silently averaged in.
2. **Reported by the participant** — the everyday-activities check-in, context factors (sleep, activity, mood/stress), family history, and genomic context only where the patient opted in.
3. **Retrieved from the clinical record, read-only** — a FHIR R4 import (`server/src/services/fhirContext.ts`), invoked on submission from `server/src/controllers/assessmentcomplete.controller.ts` when the patient ticked the optional consent on the screening screen. It resolves the patient by identifier, then queries `Observation` for a fixed LOINC allowlist (8480-6 / 8462-4 blood pressure, 2345-7 glucose, 2093-3 cholesterol, 29463-7 weight, 41950-7 step count, 93832-4 sleep duration, 55758-7 PHQ-2), last 12 months, newest 100, over HTTPS with a server-side bearer token and an 8-second timeout. The result is stored with the session as `externalContext` (status, import time, source-labelled values) and shown to the clinician on the patient profile. A `NOT_CONFIGURED`, `NO_MATCHING_DATA` or `FAILED` outcome is recorded as such and never blocks or alters the screening result.

The clinician-facing wording is deliberate: this is **context for the reviewer**, not an input to the score. Blood pressure and glucose do not move a composite number.

**On Malaffi specifically:** we are not connected to it, and we say so. Malaffi and hospital EMRs expose FHIR resources, so the integration contract we implement — identifier search on `Patient`, then `Observation` by subject and code — is the same one. Onboarding is therefore configuration (endpoint, token, identifier system) plus the data-sharing agreement and ADHICS review, not a rewrite of the model. What we have not built is worth naming too: no write-back, no `$everything` or bulk `$export`, no terminology-service dependency, no consent-registry integration, and identifier mapping is a configured system rather than a matched national ID.

To show it working without an exchange, `server/scripts/fhir-stub.mjs` serves a loopback FHIR R4 bundle with sample vitals; the import, the storage and the clinician display are all live paths, and the automated tests (`server/src/tests/fhirContext.test.ts`) drive the real HTTP exchange against that stub.

## Is this a diagnostic tool?

No. It is a screening and review workflow prototype. It is not designed to diagnose, predict disease, or tell a patient that they have a condition. The clinical opinion stays with a clinician.

## Why is the patient view limited?

Because the patient side is intentionally not the place for clinical conclusions. Patients can see their own session measurements and approved release-after-review notes, but the system does not hand them an internal risk classification or unreviewed clinician notes.

## What happens if a service is down?

The demo is built to degrade in a controlled way. If a service is unavailable, the system should still present a deterministic fallback for the part that failed, rather than failing silently or inventing a result.

## Why are scoring and explanation separate?

Because they solve different problems. Scoring decides what the assessment recorded, and it should be deterministic and testable. Explanation is a constrained restatement of those numbers in plain language. Keeping them separate makes it easier to validate the numbers and constrain the prose.

## Do you use a language model to decide results?

No. The language model, when used, is only asked to rewrite already-computed observations under a closed schema. It cannot invent numbers, and the system falls back to a deterministic explanation when the model is unavailable or the output breaks a guardrail.

## What would it take to trust this more?

More validation work. That means test-retest reliability, clinically reviewed task design, validated thresholds, and a clear plan for who interprets the results and when. The current posture is screening plus clinician review, not validated diagnosis.

## What is the most fragile part of the demo right now?

The persistence posture if the database is not reachable. The demo can still run, but the strongest claim is a verified production persistence story, not a fallback one. Fixing the database reachability and migration posture is the clearest next step.

## Is this culturally appropriate for Abu Dhabi?

Arabic is a first-class interface language with right-to-left layout and Arabic-script fonts. A participant who selects Arabic is administered the whole patient-side battery in Arabic — intro, activity instructions, spoken-repeat sentence, expression prompts, quality feedback and the completion screen — with no English fallback in the task flow. What we do **not** do is claim that wording is validated: it is a working translation, the spoken-repeat content is not a back-translated equivalent of the English stimuli, and the language registry still marks Arabic task administration as not ready, which the clinician readiness screen shows and the submission record keeps. We would rather be honest about that than hand an older Arabic speaker an unvalidated translation. The adaptation workflow is documented per language, and the clinician Assessment Readiness screen makes each stage explicit, and administering the tasks in an unreviewed language requires an explicit participant acknowledgement that is stored with the session and reported to the clinician. The Arabic task-stimuli pipeline is our headline next milestone.

## Do you use genomic information?

Only if the patient explicitly opts in. What they share is stored as source-labelled context and shown to the reviewing clinician. NeuLens does not interpret variants, calculate genetic risk, or change any score. Family history is handled the same way, as context rather than a risk calculation.

## How do you know it works in the local population?

We measure what our recorded data can support: completion, comparability rate, repeat-session variability within a person, median time to clinical review, referral completion/non-completion, and all of that split by language, age band and education band. We do **not** report sensitivity, specificity, true false-referral burden or meaningful-change accuracy yet, because those require an ethics-approved reference-standard study in the local population. The Abu Dhabi pilot protocol is written down: cohort, reference standard, sensitivity/specificity/ICC targets, and segment analysis by language, age and education (`docs/future-health-challenge/VALIDATION_STUDY_PLAN.md`).

## What runs on-device versus on the server?

Video stays on the device: MediaPipe FaceLandmarker (BlazeFace detection + 478-point 3D mesh, including the 10 iris-boundary vertices) runs in the browser over WebAssembly, and only derived measurements — iris displacement over temporal frames, EAR, gaze quadrant, blink count, head pose, fixation stability, facial expression blendshapes — leave the device. No raw frame is uploaded. Voice is different and we say so: the recorded clip is uploaded once to the Express server, forwarded to the FastAPI acoustic service, and transcribed by Gnani/Vachana; it is held in memory for analysis and never written to the database or object storage. Acoustic features (Praat jitter/shimmer, pitch, speech rate, pauses, VAD timing) are deterministic signal processing, not a learned model, and jitter/shimmer are scoped as acoustic quality/engagement signals only — they never feed a domain score, the composite, change detection or a patient endpoint.

## Does the eye tracking use iris displacement or just face detection?

Iris-boundary displacement over temporal frames. Gaze is computed as horizontal/vertical iris centre displacement relative to the inner and outer canthi of each eye, fixation stability monitors iris Euclidean drift over sliding windows, and saccades are counted from iris velocity. BlazeFace is only the first detection stage; the 3D mesh regression supplies the landmarks, and the iris vertices are what the task measures.

## How would you localise the clinical explanation for the Gulf?

The explanation pipeline is architected to plug in a sovereign Arabic model such as Jais (Inception/G42) for Gulf-Arabic plain-language summaries, behind the same closed schema and guardrails as the English path: it rewrites already-computed observations, cannot invent numbers, and falls back to a deterministic explanation when the model is unavailable or breaks a guardrail. The Arabic task stimuli and task administration remain a working translation that is not yet validated — we would rather be honest about that than ship an unreviewed translation.

## How does this help Abu Dhabi reduce false referrals to secondary care?

NeuLens prevents false referrals by enforcing comparability gates: if Haroon took a test with poor sleep or without his reading glasses, it is flagged as confounded rather than a cognitive decline. Furthermore, we surface metabolic and sleep confounders for primary-care resolution first.

Concretely: every session carries a quality/comparability flag (sleep, vision aids, mood, interruptions) and those are visible to the reviewing clinician, so a bad capture is never silently averaged into a decline score. Alongside the screening signal we surface source-labelled context — metabolic (HbA1c, BP, glucose, cholesterol, weight), sleep duration/fragmentation, daily-function check-in, wellbeing — so Dr. Mohamed can investigate reversible causes (e.g. severe sleep apnea, B12 deficiency, uncontrolled HbA1c) before rushing into specialist tertiary referrals. The score is never moved by a vital sign; context stays context, and the clinical opinion stays with the clinician.

## How does this plug into Abu Dhabi's digital health infrastructure, and where does it run?

Integration is FHIR R4 and read-only in the direction that matters today: on submission we resolve the patient by identifier and query `Observation` for a fixed LOINC allowlist (BP, glucose, cholesterol, weight, step count, sleep duration, PHQ-2), last 12 months, over HTTPS with a server-side bearer token. Malaffi and hospital EMRs expose the same resources, so onboarding is configuration (endpoint, token, identifier system) plus the data-sharing agreement and ADHICS review — not a rewrite of the model. What we do **not** do is write back: no risk summary is pushed into the longitudinal record yet, no `$everything`/bulk `$export`, no terminology service, no consent-registry integration, and identifier mapping is a configured system rather than a matched national ID. Those are named gaps, not hidden ones.

Deployment: React/Vite client, Express/TypeScript + Prisma + PostgreSQL, and a FastAPI acoustic service — standard, stateless-ish services behind environment variables, so they can be containerised and pointed at UAE sovereign clouds (Azure UAE Central / UAE North) for in-country residency. Today the demo runs on Render in Oregon (US) with the database and acoustic service alongside it, and the AI assets come from a Google CDN; patient data and audio leave the UAE until that move is made. We state that plainly rather than imply residency.

## What is the path to a real Abu Dhabi pilot?

Phase 1 is a feasibility pilot in Abu Dhabi primary healthcare centres and senior community screening programmes: 100–150 community-dwelling adults aged 55+, bilingual Arabic/English, stratified by language, age and education band. Reference standard is a clinician MoCA-informed neuropsychological assessment plus physician sign-off, with reversible causes investigated per protocol. Primary endpoints are feasibility (completion and quality flags), test–retest reliability (ICC) under matched conditions, and reduction in unnecessary secondary referrals (false-referral burden). Secondary endpoints are time to clinical review and referral completion, split by language, age and education band. Phase 2 scales to 300–500 participants with a consensus multidisciplinary diagnosis before any validated-performance claim. The prototype already provides the per-language readiness registry and clinician sign-off workflow, descriptive within-person stability, segment-level counts, comparability and review rates, and median hours to clinical review — and reports "not available" where data is insufficient.

## What is the prize story, in one line?

A patient completes a guided multimodal screening, and a clinician reviews a structured, explainable record under explicit safety constraints, with deterministic fallbacks when anything upstream is unavailable.
