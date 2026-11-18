/**
 * Identity of the fictional demo accounts.
 *
 * The demo seeds sign-in accounts only — no screening history, scores or sensor
 * measurements. These helpers still exist so any record owned by, or explicitly
 * marked as, a demonstration account is kept out of patient counts, quality
 * rates and reliability estimates rather than being counted as clinical evidence.
 */

export const DEMO_PATIENT_USER_ID = 'demo-patient-haroon';
export const DEMO_CLINICIAN_USER_ID = 'demo-clinician-mohamed';

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
