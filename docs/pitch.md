# Pitch

Neulens is a guided, multimodal cognitive screening flow with a clinician-in-the-loop review model and explicit safety constraints. A patient completes a short set of memory, attention, voice, ocular, and facial tasks; the system records structured observations, not a diagnosis; a clinician reviews the same evidence with quality warnings, domain observations, and a deterministic or constrained-draft explanation before anything is shared.

## One sentence

Neulens turns a short, guided multimodal screening into a structured, explainable review record that a clinician must approve, with hard constraints against diagnostic claims and deterministic fallbacks when any upstream service is unavailable.

## What makes it different on a judges tabletop

- The patient side is not dressed up as a final result. Patients see their own session measurements and a release-after-review note, not a risk label or clinician notes before review.
- The review side is built around a clinician reading evidence, not a system pronouncing a conclusion.
- Scoring and explanation are separated: scoring is deterministic and testable; the LLM, if used, only rewrites already-computed numbers under a closed schema and guardrails.
- The demo is designed to stay coherent when a dependency is down, because fallbacks are part of the story rather than an accident.

## What this is not

It is not a diagnostic product. It is a screening and review workflow prototype that deliberately avoids diagnosing, predicting disease, or storing a draft explanation as the clinical result.
