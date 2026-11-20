/**
 * One definition of "is this session comparable with the patient's other
 * sessions", shared by the safety/interpretation gate and by baseline creation.
 *
 * The rule is deliberately conservative: only an explicitly comparable,
 * fully-completed, low-interruption session qualifies. Missing quality metadata
 * is not comparable — a session that did not report its quality cannot be
 * treated as if it had good quality.
 */
export interface DerivedSessionQuality {
  comparable: boolean;
  completion: string;
  interruptions: number;
  reasons: string[];
}

function asRecord(value: unknown): Record<string, any> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};
}

export function deriveSessionQuality(taskResponses: unknown): DerivedSessionQuality {
  const tr = asRecord(taskResponses);
  const quality = asRecord(tr.quality);
  const comparableFlag = typeof quality.comparable === 'boolean' ? quality.comparable : undefined;
  const completion = typeof quality.completion === 'string' ? quality.completion : undefined;
  const interruptions = Number.isFinite(Number(quality.interruptions)) ? Number(quality.interruptions) : 0;

  const comparable = comparableFlag === true && completion !== 'PARTIAL' && interruptions <= 2;
  return {
    comparable,
    completion: completion || 'UNKNOWN',
    interruptions,
    reasons: [
      ...(comparableFlag === false ? ['QUALITY_NOT_COMPARABLE'] : []),
      ...(comparableFlag === undefined ? ['QUALITY_UNKNOWN'] : []),
      ...(completion === 'PARTIAL' ? ['INCOMPLETE_SESSION'] : []),
      ...(interruptions > 2 ? ['EXCESSIVE_INTERRUPTIONS'] : []),
    ] as string[],
  };
}
