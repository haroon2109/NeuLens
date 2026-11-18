# Pitch

**Fatima is 68 and screens in March.** Memory, attention, a spoken phrase, a few ocular and
facial observations, four questions about her week. Nothing is flagged — and nothing is
supposed to be, because one afternoon cannot tell you whether a person is changing.

**She returns three more times over the next two years.** Language, education, task version
and sensory access match across all four sittings, so once there are three comparable repeat
pairs the platform can measure her own session-to-session spread. By the fourth sitting her
score has fallen further than that spread accounts for — and because the conditions matched,
the difference is worth acting on. It is not a diagnosis. It is a question her clinician can
answer: *is this the beginning of something, or was she simply tired that morning?*

That question is the product. Neulens turns a short, guided multimodal screening into a
structured, explainable record that a clinician reviews and approves. Its most important
feature is the sentence it refuses to produce: *"you have dementia."*

> Fatima is an illustrative composite, not a real patient record.

## What Neulens is

A guided, multimodal cognitive screening flow with a clinician-in-the-loop review model and
explicit safety constraints. A patient completes a short set of memory, attention, voice,
ocular and facial tasks; the system records structured observations, not a diagnosis; a
clinician reviews the same evidence — quality warnings, domain observations, and a
deterministic or constrained-draft explanation — before anything is shared.

## One sentence

Neulens turns a short, guided multimodal screening into a structured, explainable review record that a clinician must approve, with hard constraints against diagnostic claims and deterministic fallbacks when any upstream service is unavailable.

## What makes it different on a judges tabletop

- The patient side is not dressed up as a final result. Patients see their own session measurements and a release-after-review note, not a risk label or clinician notes before review.
- The review side is built around a clinician reading evidence, not a system pronouncing a conclusion.
- Scoring and explanation are separated: scoring is deterministic and testable; the LLM, if used, only rewrites already-computed numbers under a closed schema and guardrails.
- The demo is designed to stay coherent when a dependency is down, because fallbacks are part of the story rather than an accident.

## Why it fits the Abu Dhabi brief

- **Arabic is a first-class interface language**, not a translation afterthought: right-to-left layout, Arabic-script fonts, and Arabic consent, check-in and results copy.
- **No cross-context comparison.** A session is only compared with earlier sessions when language, education, task version and sensory/digital access all match. Arabic and English sessions are never pooled.
- **Education and sensory access are treated as measurement conditions**, and are visible to the reviewing clinician rather than hidden inside a score.
- **Family history and consent-gated genomic context are integrated** as source-labelled context, with a hard boundary: NeuLens does not interpret variants or compute genetic risk.
- **The validation plan is local.** Completion, repeat-session stability, time to clinical review and performance by language, age and education band are computed from recorded data; sensitivity, specificity and cultural validity are named as pending a reference-standard study rather than asserted.
- **Methodological honesty is visible in the product.** The clinician Assessment Readiness screen lists each language's translation, back-translation, pretesting and sign-off status separately, requires a recorded participant acknowledgement before an unreviewed language can be administered, and lets clinicians record sign-offs. The Arabic task-stimuli pipeline is the headline next milestone, not a hidden caveat.
- **Wearable summaries are an optional, consent-gated context source** alongside sleep, activity, wellbeing, clinical, family-history and genomic context; they never change the screening score.
- **Deployment is configuration, not a rewrite.** The services are standard Node/Python/Postgres behind environment variables, integrate over FHIR R4 (read-only today, with write-back named as a next step), and can be pointed at UAE sovereign clouds for in-country residency; the current demo runs on Render in Oregon and we say so.

This is a research-stage, safety-first platform with a validation roadmap — not a validated diagnostic tool. Full pilot protocol: `docs/future-health-challenge/VALIDATION_STUDY_PLAN.md`.

Full mapping: `docs/future-health-challenge/SUBMISSION_FIT.md`.

## What this is not

It is not a diagnostic product. It is a screening and review workflow prototype that deliberately avoids diagnosing, predicting disease, or storing a draft explanation as the clinical result.
