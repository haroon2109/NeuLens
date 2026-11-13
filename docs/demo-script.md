# Demo script

## Goal

Run one complete spine from the public landing page to a clinician review without touching anything unrelated.

Spine:
1. Landing page → patient hub
2. Register a patient
3. Sign in as that patient
4. Start and finish a guided screening task
5. Submit the assessment
6. See the patient confirmation / session summary
7. Sign in as a clinician and open the same screening for review
8. Read quality warnings and domain observations
9. Generate or load the constrained explanation draft
10. Save the review status

## Before the demo

- Backend is running on `http://127.0.0.1:5000`
- Frontend is running on `http://127.0.0.1:5173`
- Database posture is known and either live or intentionally documented as fallback
- Clinician credentials are created and ready before the demo starts
- Do not rely on per-dewar external vendor keys during the demo unless they are verified live

## Suggested walkthrough

Open the landing page first. Say:
- Neulens starts as a guided screening experience, not a diagnosis screen.

Then:
- Register one patient using the patient portal path.
- Log in and complete one task through the screening flow.
- Submit and show the patient-facing confirmation or summary.
- Emphasize what the patient can and cannot see.

Then switch to the clinician view:
- Log in as the prepared clinician account.
- Open the same screening from the doctor dashboard or review queue.
- Point at the quality warnings, task completion, and domain observations.
- If available, generate the explanation draft and note the review-required marker.

## Demo safety notes to say out loud

- The system records observations and a draft explanation; it does not output a diagnosis.
- A clinician must review before anything is shared.
- If any service is unavailable, the demo still uses a deterministic fallback.

## Failure handling during the demo

If something breaks, do not improvise a new feature in front of judges.
Instead say what was supposed to happen, what the fallback is, and why the breakage does not hide the spine.
