import type { AssessmentRecord } from '../models/dataStore';

export const FUNCTIONAL_ACTIVITY_IDS = [
  'appointments',
  'medication',
  'finances',
  'household'
] as const;

export type FunctionalActivityId = typeof FUNCTIONAL_ACTIVITY_IDS[number];
export type ContextFactorId = 'sleep' | 'activity' | 'moodStress';

export interface PatientChangeSummary {
  status: 'INSUFFICIENT_DATA' | 'NO_CHANGE' | 'REVIEW';
  cognitive: {
    latestScore: number | null;
    previousScore: number | null;
    change: number | null;
    baselineRange: { minimum: number; maximum: number } | null;
    comparableAssessments: number;
    outsideObservedBaseline: boolean;
  };
  function: {
    currentActivityLevels: Partial<Record<FunctionalActivityId, number>>;
    worsenedActivityIds: FunctionalActivityId[];
    currentCheckInDate: string | null;
    previousCheckInDate: string | null;
  };
  context: {
    currentFactors: Partial<Record<ContextFactorId, number>>;
    changedFactors: ContextFactorId[];
  };
  reviewReasons: Array<'OUTSIDE_OBSERVED_BASELINE' | 'FUNCTIONAL_CHANGE' | 'CONTEXT_CHANGE'>;
}

interface AssessmentContext {
  language: string;
  ageYears: number | null;
  educationYears: number | null;
  taskVersion: string;
  accessibility: {
    vision: number;
    hearing: number;
    motor: number;
    digitalFamiliarity: number;
  };
}

interface FunctionalCheckIn {
  completedAt: string;
  activities: Partial<Record<FunctionalActivityId, number>>;
  contextFactors?: Record<ContextFactorId, number>;
  assessmentContext?: AssessmentContext;
}

function getFunctionalCheckIn(assessment: AssessmentRecord): FunctionalCheckIn | null {
  const checkIn = assessment.taskResponses?.functionalCheckIn;
  if (!checkIn || checkIn.skipped || !checkIn.activities || typeof checkIn.activities !== 'object') {
    return null;
  }

  const activities: Partial<Record<FunctionalActivityId, number>> = {};
  for (const id of FUNCTIONAL_ACTIVITY_IDS) {
    const value = checkIn.activities[id];
    if (Number.isInteger(value) && value >= 0 && value <= 2) {
      activities[id] = value;
    }
  }

  if (Object.keys(activities).length === 0) return null;
  const suppliedDate = typeof checkIn.completedAt === 'string' ? new Date(checkIn.completedAt) : null;
  const completedAt = suppliedDate && Number.isFinite(suppliedDate.getTime())
    ? suppliedDate.toISOString()
    : new Date(assessment.date).toISOString();
  const context = checkIn.assessmentContext;
  const assessmentContext = context &&
    typeof context.language === 'string' &&
    (context.ageYears === null || Number.isInteger(context.ageYears)) &&
    typeof context.taskVersion === 'string' &&
    (context.educationYears === null || Number.isInteger(context.educationYears)) &&
    context.accessibility &&
    ['vision', 'hearing', 'motor', 'digitalFamiliarity'].every(key =>
      Number.isInteger(context.accessibility[key as keyof AssessmentContext['accessibility']]) &&
      context.accessibility[key as keyof AssessmentContext['accessibility']] >= 0 &&
      context.accessibility[key as keyof AssessmentContext['accessibility']] <= 2
    )
    ? context as AssessmentContext
    : undefined;
  const contextFactors = checkIn.contextFactors &&
    ['sleep', 'activity', 'moodStress'].every(key =>
      Number.isInteger(checkIn.contextFactors[key]) &&
      checkIn.contextFactors[key] >= 0 &&
      checkIn.contextFactors[key] <= 2
    )
    ? checkIn.contextFactors as Record<ContextFactorId, number>
    : undefined;
  return { completedAt, activities, contextFactors, assessmentContext };
}

function areComparable(current: FunctionalCheckIn, previous: FunctionalCheckIn): boolean {
  const a = current.assessmentContext;
  const b = previous.assessmentContext;
  return Boolean(a && b &&
    a.language === b.language &&
    a.educationYears === b.educationYears &&
    a.taskVersion === b.taskVersion &&
    a.accessibility.vision === b.accessibility.vision &&
    a.accessibility.hearing === b.accessibility.hearing &&
    a.accessibility.motor === b.accessibility.motor &&
    a.accessibility.digitalFamiliarity === b.accessibility.digitalFamiliarity);
}

export function summarizePatientChanges(assessments: AssessmentRecord[]): PatientChangeSummary {
  const completed = assessments
    .filter(assessment => assessment.status === 'COMPLETED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = completed[0];
  const checkIns = completed
    .map(assessment => ({
      assessment,
      checkIn: getFunctionalCheckIn(assessment)
    }))
    .filter((entry): entry is { assessment: AssessmentRecord; checkIn: FunctionalCheckIn } => Boolean(entry.checkIn));
  const currentCheckIn = checkIns[0];
  const previousCheckIn = checkIns[1];
  const currentCheckInIsLatest = currentCheckIn && currentCheckIn.assessment.id === latest?.id;
  const comparableHistory = currentCheckInIsLatest
    ? checkIns.slice(1).filter(entry => areComparable(currentCheckIn.checkIn, entry.checkIn))
    : [];
  const baselineAssessments = comparableHistory.slice(0, 3);
  const baselineValues = baselineAssessments.map(entry => entry.assessment.overallScore);
  const baselineRange = baselineValues.length === 3
    ? {
        minimum: Math.min(...baselineValues),
        maximum: Math.max(...baselineValues)
      }
    : null;
  const previousComparable = comparableHistory[0]?.assessment;
  const cognitiveChange = latest && previousComparable
    ? Number((latest.overallScore - previousComparable.overallScore).toFixed(1))
    : null;
  const outsideObservedBaseline = Boolean(
    latest && currentCheckInIsLatest && baselineRange && latest.overallScore < baselineRange.minimum
  );
  const worsenedActivityIds: FunctionalActivityId[] = [];
  const changedFactors: ContextFactorId[] = [];

  if (currentCheckInIsLatest && previousCheckIn) {
    for (const id of FUNCTIONAL_ACTIVITY_IDS) {
      const currentValue = currentCheckIn.checkIn.activities[id];
      const previousValue = previousCheckIn.checkIn.activities[id];
      if (currentValue !== undefined && previousValue !== undefined && currentValue > previousValue) {
        worsenedActivityIds.push(id);
      }
    }
    for (const id of ['sleep', 'activity', 'moodStress'] as const) {
      const currentValue = currentCheckIn.checkIn.contextFactors?.[id];
      const previousValue = previousCheckIn.checkIn.contextFactors?.[id];
      if (currentValue !== undefined && previousValue !== undefined && currentValue > previousValue) {
        changedFactors.push(id);
      }
    }
  }

  const reviewReasons: PatientChangeSummary['reviewReasons'] = [];
  if (outsideObservedBaseline) reviewReasons.push('OUTSIDE_OBSERVED_BASELINE');
  if (worsenedActivityIds.length > 0) reviewReasons.push('FUNCTIONAL_CHANGE');
  if (changedFactors.length > 0) reviewReasons.push('CONTEXT_CHANGE');

  const hasComparableData = Boolean(
    baselineRange ||
    (currentCheckInIsLatest && previousCheckIn && areComparable(currentCheckIn.checkIn, previousCheckIn.checkIn))
  );
  return {
    status: reviewReasons.length > 0 ? 'REVIEW' : hasComparableData ? 'NO_CHANGE' : 'INSUFFICIENT_DATA',
    cognitive: {
      latestScore: latest?.overallScore ?? null,
      previousScore: previousComparable?.overallScore ?? null,
      change: cognitiveChange,
      baselineRange,
      comparableAssessments: comparableHistory.length + (currentCheckInIsLatest ? 1 : 0),
      outsideObservedBaseline
    },
    function: {
      currentActivityLevels: currentCheckInIsLatest ? currentCheckIn.checkIn.activities : {},
      worsenedActivityIds,
      currentCheckInDate: currentCheckInIsLatest ? currentCheckIn.checkIn.completedAt : null,
      previousCheckInDate: currentCheckInIsLatest ? previousCheckIn?.checkIn.completedAt ?? null : null
    },
    context: {
      currentFactors: currentCheckInIsLatest ? currentCheckIn.checkIn.contextFactors ?? {} : {},
      changedFactors
    },
    reviewReasons
  };
}
