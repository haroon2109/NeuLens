import type { AssessmentRecord, UserRecord } from '../models/dataStore';
import { HospitalDataStore } from '../models/dataStore';

type GroupMetric = {
  group: string;
  assessments: number;
  comparableRate: number | null;
  averageQualityScore: number | null;
  averageOverallScore: number | null;
  reviewRate: number | null;
};

function safeNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getQuality(assessment: AssessmentRecord) {
  const tr = (assessment.taskResponses || {}) as any;
  const q = tr.quality || {};
  return {
    comparable: q.comparable === true,
    completion: typeof q.completion === 'string' ? q.completion : 'UNKNOWN',
    interruptions: Number.isFinite(Number(q.interruptions)) ? Number(q.interruptions) : null,
    score: safeNumber(q.score),
  };
}

function ageBand(age: number | null | undefined): string {
  if (!Number.isFinite(Number(age))) return 'unknown';
  const a = Number(age);
  if (a < 60) return '<60';
  if (a < 70) return '60-69';
  if (a < 80) return '70-79';
  return '80+';
}

function groupMetrics<T extends string>(items: AssessmentRecord[], keyFn: (a: AssessmentRecord) => T): GroupMetric[] {
  const by = new Map<string, AssessmentRecord[]>();
  for (const a of items) {
    const k = keyFn(a) || 'unknown';
    by.set(k, [...(by.get(k) || []), a]);
  }
  return Array.from(by.entries()).map(([group, arr]) => {
    const qualities = arr.map(getQuality);
    const comparable = qualities.filter(q => q.comparable).length;
    const qScores = qualities.map(q => q.score).filter((v): v is number => v != null);
    const scores = arr.map(a => safeNumber(a.overallScore)).filter((v): v is number => v != null);
    const reviews = arr.filter(a => a.reviewStatus === 'PENDING_REVIEW' || a.reviewStatus === 'FOLLOWUP_REQUIRED').length;
    return {
      group,
      assessments: arr.length,
      comparableRate: arr.length ? Number((comparable / arr.length).toFixed(3)) : null,
      averageQualityScore: qScores.length ? Number((qScores.reduce((s, v) => s + v, 0) / qScores.length).toFixed(2)) : null,
      averageOverallScore: scores.length ? Number((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2)) : null,
      reviewRate: arr.length ? Number((reviews / arr.length).toFixed(3)) : null,
    };
  }).sort((a, b) => b.assessments - a.assessments);
}

export async function computePlatformInsights() {
  const patients = await HospitalDataStore.listPatients('', 'ALL');
  const details = await Promise.all(patients.map(p => HospitalDataStore.getPatientDetail(p.id)));
  const patientById = new Map<string, UserRecord>();
  const allAssessments: AssessmentRecord[] = [];

  for (const d of details) {
    if (!d) continue;
    patientById.set(d.patient.id, d.patient);
    for (const a of d.assessments) allAssessments.push(a);
  }

  const completed = allAssessments.filter(a => a.status === 'COMPLETED');
  const qualities = completed.map(getQuality);
  const comparableCount = qualities.filter(q => q.comparable).length;
  const pendingReview = completed.filter(a => a.reviewStatus === 'PENDING_REVIEW').length;
  const followupRequired = completed.filter(a => a.reviewStatus === 'FOLLOWUP_REQUIRED').length;
  const withBaseline = patients.filter(p => p.assessmentCount >= 1).length; // proxy: has at least one session
  const withEstablishedBaseline = (await Promise.all(details.map(d => d ? HospitalDataStore.getActiveBaseline(d.patient.id) : null))).filter(Boolean).length;

  // Longitudinal follow-up: patients with >=2 completed assessments and days since last
  const followUp = details.filter(Boolean).map(d => {
    const list = (d!.assessments || []).filter(a => a.status === 'COMPLETED').sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime());
    const last = list[0]?.date ? new Date(list[0].date) : null;
    const daysSinceLast = last ? Math.floor((Date.now() - last.getTime()) / (24*3600*1000)) : null;
    const due = daysSinceLast == null ? 'NOT_STARTED' : daysSinceLast > 90 ? 'OVERDUE' : daysSinceLast > 30 ? 'DUE_SOON' : 'ON_TRACK';
    return {
      patientId: d!.patient.patientId,
      patientName: d!.patient.name,
      completedAssessments: list.length,
      lastAssessmentDate: last ? last.toISOString() : null,
      daysSinceLast,
      followUpStatus: due,
      reviewStatus: list[0]?.reviewStatus || 'NOT_SCREENED',
    };
  }).sort((a,b) => (b.daysSinceLast ?? -1) - (a.daysSinceLast ?? -1));

  const assessmentWithPatient = (a: AssessmentRecord) => patientById.get(a.userId);
  const byLanguage = groupMetrics(completed, a => (assessmentWithPatient(a)?.language || 'unknown'));
  const byGender = groupMetrics(completed, a => (assessmentWithPatient(a)?.gender || 'unknown'));
  const byAgeBand = groupMetrics(completed, a => ageBand(assessmentWithPatient(a)?.age));
  const byQuality = groupMetrics(completed, a => getQuality(a).comparable ? 'comparable' : 'not_comparable');

  const qualityScores = qualities.map(q => q.score).filter((v): v is number => v != null);

  return {
    generatedAt: new Date().toISOString(),
    scope: 'CLINICIAN_PLATFORM_OVERVIEW',
    notes: [
      'Descriptive quality and fairness measurements computed from available recorded data only; no imputed or synthetic values.',
      'Differences across groups do not establish bias or causality; investigate measurement conditions, access, and sample size.',
      'Poor-quality/non-comparable sessions are safety-gated from change interpretation.',
    ],
    population: {
      patients: patients.length,
      patientsWithActiveBaseline: withEstablishedBaseline,
      completedAssessments: completed.length,
    },
    safetyGates: {
      comparableAssessments: comparableCount,
      nonComparableAssessments: completed.length - comparableCount,
      comparabilityRate: completed.length ? Number((comparableCount / completed.length).toFixed(3)) : null,
      pendingClinicalReview: pendingReview,
      followUpRequired: followupRequired,
      averageSessionQualityScore: qualityScores.length ? Number((qualityScores.reduce((s,v)=>s+v,0)/qualityScores.length).toFixed(2)) : null,
    },
    longitudinalFollowUp: {
      onTrack: followUp.filter(f => f.followUpStatus === 'ON_TRACK').length,
      dueSoon: followUp.filter(f => f.followUpStatus === 'DUE_SOON').length,
      overdue: followUp.filter(f => f.followUpStatus === 'OVERDUE').length,
      notStarted: followUp.filter(f => f.followUpStatus === 'NOT_STARTED').length,
      patients: followUp.slice(0, 50),
    },
    qualityMeasurement: {
      byComparability: byQuality,
    },
    fairnessMeasurement: {
      byLanguage,
      byGender,
      byAgeBand,
      caveat: 'Group metrics are reported only where data exists and may reflect small samples or confounding context; use for monitoring quality/fairness, not for clinical conclusions.',
    },
  };
}
