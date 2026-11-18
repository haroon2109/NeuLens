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

## Is this culturally appropriate for Abu Dhabi?

Arabic is a first-class interface language with right-to-left layout and Arabic-script fonts, covering navigation, consent, the daily-function check-in and results. What we do **not** do is claim validated Arabic task stimuli: the spoken-repeat sentence and the piano-sequencing instructions are administered in Arabic, while the remaining task copy is English, and all of it is labelled as pending back-translation, cognitive pretesting and local clinical review. We would rather be honest about that than hand an older Arabic speaker an unvalidated translation. The adaptation workflow is documented per language, and the clinician Assessment Readiness screen makes each stage explicit, and administering the tasks in an unreviewed language requires an explicit participant acknowledgement that is stored with the session and reported to the clinician. The Arabic task-stimuli pipeline is our headline next milestone.

## Do you use genomic information?

Only if the patient explicitly opts in. What they share is stored as source-labelled context and shown to the reviewing clinician. NeuLens does not interpret variants, calculate genetic risk, or change any score. Family history is handled the same way, as context rather than a risk calculation.

## How do you know it works in the local population?

We measure what our recorded data can support: completion, comparability rate, repeat-session variability within a person, median time to clinical review, referral completion/non-completion, and all of that split by language, age band and education band. We do **not** report sensitivity, specificity, true false-referral burden or meaningful-change accuracy yet, because those require an ethics-approved reference-standard study in the local population. The Abu Dhabi pilot protocol is written down: cohort, reference standard, sensitivity/specificity/ICC targets, and segment analysis by language, age and education (`docs/future-health-challenge/VALIDATION_STUDY_PLAN.md`).

## What is the prize story, in one line?

A patient completes a guided multimodal screening, and a clinician reviews a structured, explainable record under explicit safety constraints, with deterministic fallbacks when anything upstream is unavailable.
