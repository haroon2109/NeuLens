/**
 * Identity of the fictional demo workspace.
 *
 * The jury demo needs a populated portal without a database. That data is
 * invented, so it must never be counted as clinical evidence: a demonstration
 * record appearing inside a real deployment's patient counts, quality rates or
 * reliability estimate is indistinguishable from fabricated data.
 *
 * Everything here exists so those records can be recognised and kept out of
 * aggregates. They are still visible inside the demo workspace itself.
 */

export const DEMO_PATIENT_USER_ID = 'demo-patient-margaret-ellis';
export const DEMO_CLINICIAN_USER_ID = 'demo-clinician-amara-okafor';

/** True for the seeded fictional accounts (patient or clinician). */
export function isDemoUserId(userId: string | null | undefined): boolean {
  return userId === DEMO_PATIENT_USER_ID || userId === DEMO_CLINICIAN_USER_ID;
}

/** True for a seeded demonstration assessment. */
export function isDemoAssessment(
  assessment: { userId?: string | null; taskResponses?: unknown } | null | undefined
): boolean {
  if (!assessment) return false;
  if (assessment.userId === DEMO_PATIENT_USER_ID) return true;
  const responses = assessment.taskResponses as { mode?: string } | null | undefined;
  return responses?.mode === 'DEMO';
}
