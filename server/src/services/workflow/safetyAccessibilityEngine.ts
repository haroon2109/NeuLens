import type { SafetyAccessibilityResult } from './types';
import { deriveSessionQuality } from '../sessionQuality';

// Re-exported so existing callers keep one import path for the comparability rule.
export { deriveSessionQuality };

function asRecord(value: unknown): Record<string, any> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};
}

export function evaluateSafetyAccessibility(taskResponses: unknown, contextInputs: any[]): SafetyAccessibilityResult {
  const tr = asRecord(taskResponses);
  const sessionQuality = deriveSessionQuality(taskResponses);

  // Consent: recorded only if explicitly present; missing stays missing (never assumed).
  // The screening flow records it as `externalContextConsent`; older records used
  // `consent` / `consentRecord`, which are still read.
  const consent = asRecord(tr.consent || tr.consentRecord || tr.externalContextConsent);
  const consentRecorded = consent.granted === true || consent.accepted === true || consent.recorded === true;
  const consentMissing = !consentRecorded && Object.keys(consent).length === 0;

  // Urgent flags: deterministic extraction from explicitly reported fields only.
  const urgentFlags: string[] = [];
  const safety = asRecord(tr.safety || tr.urgent || tr.urgentConcerns);
  const scanUrgent = (obj: Record<string, any>, prefix = '') => {
    for (const [k, v] of Object.entries(obj || {})) {
      if (v === true || (typeof v === 'string' && /urgent|immediate|emergency|severe|harm|suicid/i.test(v))) {
        urgentFlags.push(prefix ? `${prefix}.${k}` : k);
      }
    }
  };
  scanUrgent(safety);
  if (Array.isArray(tr.urgentFlags)) {
    for (const f of tr.urgentFlags) if (typeof f === 'string' && f.trim()) urgentFlags.push(f.trim());
  }

  const hasContext = (contextInputs || []).length > 0 || !!asRecord(tr.contextFactors || tr.context || tr.healthContext);
  const missingContext: string[] = [];
  if (!hasContext) missingContext.push('health_context_not_recorded');
  if (consentMissing) missingContext.push('consent_record_missing');

  const canInterpretChange = sessionQuality.comparable; // quality/comparability gate for change interpretation

  return {
    sessionQuality,
    consent: {
      recorded: consentRecorded,
      missing: consentMissing,
      details: consentRecorded ? ['CONSENT_RECORDED'] : consentMissing ? ['CONSENT_NOT_RECORDED'] : ['CONSENT_NOT_GRANTED_OR_INCOMPLETE'],
    },
    urgentFlags,
    accessibility: {
      contextAvailable: hasContext,
      missingContext,
      qualityGated: !sessionQuality.comparable,
    },
    canInterpretChange,
  };
}
