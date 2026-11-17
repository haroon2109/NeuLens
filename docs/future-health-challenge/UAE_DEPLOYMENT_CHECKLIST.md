# UAE deployment configuration — checklist

Status of item 5 ("UAE deployment config: set local clinic/contact details,
privacy/consent text, and care/referral pathways to UAE requirements; only
claim suitability/validation once evidenced").

NeuLens is a **developing prototype**. Nothing below claims a completed
UAE deployment; each line is either `DONE (code)` or `PENDING (human/legal)`.

## A. Clinic identity and contact details
- [DONE (code)] `client/src/config/deployment.ts` reads clinic identity from
  Vite env (`VITE_CLINIC_NAME`, `VITE_CLINIC_CITY`, `VITE_CLINIC_ADDRESS`,
  `VITE_CLINIC_PHONE`, `VITE_CLINIC_EMERGENCY`, `VITE_SUPPORT_EMAIL`) and
  falls back to neutral labels when unset. No fabricated hospital name,
  institution ID, or phone number ships in the bundle.
- [DONE (code)] `client/.env.example` documents the variables.
- [DONE (code)] Doctor portal footer and patient completion card use
  `deploymentConfig` instead of "Neulens General Hospital".
- [PENDING (human)] Supply real values for the deploying Abu Dhabi clinic.
- [PENDING (human)] Confirm DOH/Abu Dhabi facility licensing and any
  required registration numbers are displayed where mandated.

## B. Privacy, consent and data governance
- [DONE (code)] Consent screen exists (`ConsentPrivacyPage`) with required/
  optional items and "Screening support, not a diagnosis" framing.
- [PENDING (human/legal)] Privacy policy text reviewed against UAE PDPL
  (Federal Decree-Law No. 45 of 2021) and, where applicable, Abu Dhabi
  health-data regulations (ADHICS/DOH). Link via `VITE_PRIVACY_URL`.
- [PENDING (human/legal)] Consent wording reviewed for Arabic (MSA/Gulf) by
  a UAE-based reviewer; see `ARABIC_REVIEWER_WORKSHEET.md`.
- [PENDING (human/legal)] Data residency, retention, and cross-border
  transfer commitments documented and reflected in deployment config.
- [PENDING (human/legal)] Terms of use reviewed and linked via
  `VITE_TERMS_URL`.

## C. Care and referral pathways
- [DONE (code)] Referral model exists (doctor portal referrals, appointments,
  care plan). Destination/urgency/status fields are clinician-entered.
- [PENDING (human/clinical)] Local referral destinations (Abu Dhabi
  hospitals, memory clinics, geriatrics, social services) seeded for the
  deploying site; no fabricated destinations ship.
- [PENDING (human/clinical)] Emergency/urgent pathway wording and the
  emergency number (`VITE_CLINIC_EMERGENCY`) agreed with the deploying clinic.
- [PENDING (human/clinical)] Follow-up timeline and who contacts the patient
  defined and documented.

## D. Language and locale
- [DONE (code)] Arabic (`ar-AE`) selectable; `dir="rtl"` applied to `<html>`;
  date/time formatters read `document.documentElement.lang`.
- [DONE (code)] Doctor portal forced `dir="ltr"` so a patient's Arabic choice
  cannot invert the English clinical UI.
- [PENDING (human)] Full Arabic RTL/UX audit of every screen (see item 3
  notes); Arabic font loading verified on target devices.

## E. Accessibility
- [DONE (code)] Draft sensor-free Arabic pathway at
  `/patient/accessible-checkin` (word-list recall + 4-item daily-function
  check-in), RTL, large buttons, keyboard, screen-reader live region,
  optional browser TTS, no camera/mic/sensor. Stamped
  `DRAFT_NOT_VALIDATED` / `ACCESSIBLE_NO_CAMERA_NO_MIC`.
- [PENDING (human)] Screen-reader + target-user usability testing
  (`ARABIC_ACCESSIBLE_PATHWAY_VALIDATION.md`, section 4).
- [PENDING (human)] IVR/phone route: scripted only, not implemented or
  validated. Implement only if the target population needs it.

## F. Clinical evidence
- [BLOCKED] No licensed Arabic screener integrated, no reliability study,
  no pilot, no sensitivity/specificity. Do not claim suitability or
  validation until evidenced. See `README.md` "Known defects".
