/**
 * One client-side reading of "comparable session", matching the server's rule
 * (`server/src/services/sessionQuality.ts`). The clinician portal used to treat a
 * session with no quality metadata as comparable, while the server treated it as
 * unverified — so the two portals reported different counts for the same record.
 */
export const isComparableSession = (session: { taskResponses?: any } | null | undefined): boolean => {
  const quality = session?.taskResponses?.quality;
  if (!quality || typeof quality !== 'object') return false;
  if (quality.comparable !== true) return false;
  if (quality.completion === 'PARTIAL') return false;
  const interruptions = Number(quality.interruptions);
  return !(Number.isFinite(interruptions) && interruptions > 2);
};

/** Why a session is not comparable, in the order the server reports it. */
export const comparabilityReasons = (session: { taskResponses?: any } | null | undefined): string[] => {
  const quality = session?.taskResponses?.quality;
  if (!quality || typeof quality !== 'object') return ['QUALITY_UNKNOWN'];
  const reasons: string[] = [];
  if (quality.comparable === false) reasons.push('QUALITY_NOT_COMPARABLE');
  if (quality.comparable === undefined) reasons.push('QUALITY_UNKNOWN');
  if (quality.completion === 'PARTIAL') reasons.push('INCOMPLETE_SESSION');
  if (Number(quality.interruptions) > 2) reasons.push('EXCESSIVE_INTERRUPTIONS');
  return reasons;
};
