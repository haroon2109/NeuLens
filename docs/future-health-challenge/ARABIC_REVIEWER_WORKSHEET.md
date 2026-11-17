# Arabic (UAE) linguistic and cultural review — reviewer worksheet

Status of item 2 ("Linguistic/cultural review: have UAE-based Arabic
(MSA/Gulf/Emirati as appropriate) reviewers and clinicians adapt wording,
stimuli, and examples for local comprehension and cultural fit").

This worksheet lists every user-facing English string that currently ships
in the Arabic (`ar-AE`) build, grouped by surface, so a UAE-based reviewer
can forward-review, back-translate, and sign off. **No review has been
performed yet**; all rows are PENDING. Do not flip `ARABIC_ENABLED` or
claim Arabic readiness until a reviewer signs the columns below.

## How to use
Columns: `ID | Source (EN) | Current (AR) | Reviewer rewrite (AR) |
Back-translation (EN) | Comprehension (1-5) | Cultural fit (1-5) |
Reviewer | Date | Sign-off`.
A row is "done" only when Reviewer rewrite + Back-translation + Sign-off
are all filled and Comprehension/Cultural fit ≥ 4.

## A. Patient portal navigation (`portalTranslations.ts`)
IDs P-NAV-01.. already covered by the `ar` block. Reviewer focus:
- "صحة الدماغ" (Brain health) — confirm Gulf/Emirati term; alternatives
  "صحة العقل", "الصحة الدماغية".
- "كشف التغيير" (Change detection) — confirm comprehension for low-education.
- "خطة الوقاية شخصية" (Personalized Prevention Plan) — grammar/word order.
- "الرفاهية النفسية" (Mental wellbeing) — stigma-sensitive wording.

## B. Consent and privacy (`ConsentPrivacyPage`, portal consent block)
- "بياناتك، خياراتك" — confirm.
- Required/optional item wording — confirm no coercion.
- "دعم الفحص وليس تشخيصًا" — keep as the standard disclaimer.

## C. Context pages
- Sleep/lifestyle, wellbeing, clinical & family history descriptions.
- "تقرير ذاتي قصير يضع جلسة الفحص في سياقها. ليس تشخيصًا للمزاج ولا أداة
  فحص مُتحقق منها." — confirm.

## D. Accessible Arabic pathway (`AccessibleArabicCheckinPage.tsx`,
   `draftArabicCheckin.ts`) — word-list recall + 4-item daily function
- Word-list stimuli: are the 5 words culturally familiar and unambiguous
  for low-education Gulf/Emirati adults? Replace any that are not.
- "هل يمكنك إدارة أموالك/أدويةك/مواعيدك/تنقلك" daily-function items —
  confirm local comprehension.
- TTS voice (`ar-SA`/`ar-AE` depending on browser) — confirm intelligibility.

## E. Cognitive task instructions (English-only today)
- Task intros, "look at the screen", button labels. These are NOT yet
  translated; Arabic task administration is not validated. Mark as
  `NOT_TRANSLATED` until translated and reviewed.

## F. Clinician-facing (doctor portal)
- Doctor portal is English-only by design (`dir="ltr"`). No Arabic
  translation required for MVP, but any patient-facing strings that leak
  into doctor screens must be checked.

## Sign-off
Reviewer name / role / institution / date: ____________________
Clinician co-sign (local): ____________________
Status: PENDING (no review performed).
