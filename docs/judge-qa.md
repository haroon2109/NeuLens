# Judge Q&A

## What does Neulens actually do?

It guides a patient through a short multimodal screening and produces a structured reviewable record that a clinician opens afterward. The system records observations about memory, attention, voice, ocular, and facial behavior during the session, then presents them with quality warnings and domain observations so a clinician can review before anything is shared.

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

## What is the prize story, in one line?

A patient completes a guided multimodal screening, and a clinician reviews a structured, explainable record under explicit safety constraints, with deterministic fallbacks when anything upstream is unavailable.
