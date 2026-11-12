import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { doctorApi } from '../../../services/portalApi';
import { useDoctorPortalStore } from '../../../store/doctorPortalStore';

export interface DoctorPatient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender?: string;
  language?: string;
  email?: string;
  phone?: string;
  educationYears?: number | null;
  handedness?: string | null;
  dob?: string | null;
}

export interface DoctorAssessment {
  id: string;
  userId: string;
  date: string;
  overallScore: number;
  assessmentType?: string;
  riskLevel: string;
  status: string;
  reviewStatus: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  taskResponses?: Record<string, any>;
  eyeMetrics?: { reactionTime?: number; blinkRate?: number; fixationScore?: number } | null;
  voiceMetrics?: { speechRate?: number; pauseScore?: number; jitter?: number; shimmer?: number } | null;
  faceMetrics?: { symmetry?: number; tremorScore?: number } | null;
  report?: { recommendation?: string; doctorNotes?: string; id?: string } | null;
}

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
    currentActivityLevels: Record<string, number>;
    worsenedActivityIds: string[];
    currentCheckInDate: string | null;
    previousCheckInDate: string | null;
  };
  context: {
    currentFactors: Record<string, number>;
    changedFactors: string[];
  };
  reviewReasons: Array<'OUTSIDE_OBSERVED_BASELINE' | 'FUNCTIONAL_CHANGE' | 'CONTEXT_CHANGE'>;
}

export interface DoctorPatientDetail {
  patient: DoctorPatient;
  assessments: DoctorAssessment[];
  changeSummary: PatientChangeSummary | null;
  isLocal?: boolean;
}

const synthesizeLocalPatient = (patientId: string): DoctorPatientDetail | null => {
  const local = useDoctorPortalStore
    .getState()
    .registeredPatients.find((item) => item.patientId === patientId || item.id === patientId);
  if (!local) return null;
  return {
    patient: {
      id: local.id,
      patientId: local.patientId,
      name: local.name,
      age: local.age,
      gender: local.gender,
      language: local.language,
      email: local.email,
      phone: local.phone,
      dob: local.dob
    },
    assessments: [],
    changeSummary: null,
    isLocal: true
  };
};

export const doctorPatientQueryKey = (patientId?: string) => ['doctor', 'patient', patientId] as const;

/**
 * Loads a patient record from the API and falls back to a locally registered
 * demo patient when the API does not know the id yet.
 */
const fetchPatientDetail = async (patientId: string): Promise<DoctorPatientDetail> => {
  try {
    const data = await doctorApi.getPatientProfile(patientId);
    return {
      patient: data.patient,
      assessments: data.assessments || [],
      changeSummary: data.changeSummary || null
    };
  } catch (err) {
    const local = synthesizeLocalPatient(patientId);
    if (local) return local;
    throw err instanceof Error ? err : new Error('Unable to load this patient record.');
  }
};

export const useDoctorPatient = (patientId?: string) => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: doctorPatientQueryKey(patientId),
    queryFn: () => fetchPatientDetail(patientId as string),
    enabled: Boolean(patientId)
  });

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    ...(data || { patient: null, assessments: [], changeSummary: null }),
    isLoading: Boolean(patientId) && isPending,
    error: error ? (error instanceof Error ? error.message : 'Unable to load this patient record.') : null,
    refresh
  };
};

export const getQuality = (assessment?: DoctorAssessment | null) => {
  const quality = assessment?.taskResponses?.quality || {};
  return {
    audio: quality.audio || 'GOOD',
    video: quality.video || 'GOOD',
    completion: quality.completion || 'FULL',
    comprehension: quality.comprehension || 'CLEAR',
    interruptions: quality.interruptions ?? 0,
    comparable: quality.comparable !== false
  };
};

export const taskStatus = (assessment?: DoctorAssessment | null) => {
  const tasks = assessment?.taskResponses || {};
  return [
    { id: 'task1', label: 'Visual attention & eye movement', complete: Boolean(tasks.task1) },
    { id: 'task2', label: 'Memory & attention', complete: Boolean(tasks.task2) },
    { id: 'task3', label: 'Voice & speech', complete: Boolean(tasks.task3) },
    { id: 'task4', label: 'Facial movement', complete: Boolean(tasks.task4) },
    { id: 'task5', label: 'Functional sequencing', complete: Boolean(tasks.task5) }
  ];
};

export const domainObservations = (assessment?: DoctorAssessment | null) => {
  const tasks = assessment?.taskResponses || {};
  return [
    {
      id: 'cognitive',
      domain: 'Cognitive',
      icon: 'Brain',
      values: [
        { label: 'Overall screening score', value: assessment ? `${Math.round(assessment.overallScore)} / 100` : 'Unavailable' },
        { label: 'Matched pairs', value: tasks.task2?.matchedPairs !== undefined ? `${tasks.task2.matchedPairs} of 8` : 'Missing' },
        { label: 'Mismatches', value: tasks.task2?.mismatches !== undefined ? String(tasks.task2.mismatches) : 'Missing' },
        { label: 'Completion time', value: tasks.task2?.completionTimeSec !== undefined ? `${tasks.task2.completionTimeSec}s` : 'Missing' }
      ]
    },
    {
      id: 'ocular',
      domain: 'Ocular',
      icon: 'Eye',
      values: [
        { label: 'Saccadic latency', value: tasks.task1?.saccadicLatencyMs !== undefined ? `${tasks.task1.saccadicLatencyMs} ms` : 'Missing' },
        { label: 'Fixation hold', value: tasks.task1?.fixationHoldPct !== undefined ? `${tasks.task1.fixationHoldPct}%` : 'Missing' },
        { label: 'Target errors', value: tasks.task1?.targetErrors !== undefined ? String(tasks.task1.targetErrors) : 'Missing' },
        { label: 'Blink rate', value: assessment?.eyeMetrics?.blinkRate !== undefined ? `${assessment.eyeMetrics.blinkRate}/min` : 'Missing' }
      ]
    },
    {
      id: 'vocal',
      domain: 'Vocal',
      icon: 'Mic',
      values: [
        { label: 'Speech rate', value: tasks.task3?.wpm !== undefined ? `${tasks.task3.wpm} words/min` : 'Missing' },
        { label: 'Jitter', value: tasks.task3?.jitterPct !== undefined ? `${tasks.task3.jitterPct}%` : 'Missing' },
        { label: 'Shimmer', value: tasks.task3?.shimmerPct !== undefined ? `${tasks.task3.shimmerPct}%` : 'Missing' },
        { label: 'Pause score', value: assessment?.voiceMetrics?.pauseScore !== undefined ? `${assessment.voiceMetrics.pauseScore} / 100` : 'Missing' }
      ]
    },
    {
      id: 'facial',
      domain: 'Facial / behavioural',
      icon: 'Smile',
      values: [
        { label: 'Symmetry', value: tasks.task4?.facialSymmetryScore !== undefined ? `${tasks.task4.facialSymmetryScore}%` : 'Missing' },
        { label: 'Smile intensity', value: tasks.task4?.smileIntensityPct !== undefined ? `${tasks.task4.smileIntensityPct}%` : 'Missing' },
        { label: 'Eye elevation', value: tasks.task4?.eyeElevationPct !== undefined ? `${tasks.task4.eyeElevationPct}%` : 'Missing' },
        { label: 'Observed tremor score', value: assessment?.faceMetrics?.tremorScore !== undefined ? String(assessment.faceMetrics.tremorScore) : 'Missing' }
      ]
    },
    {
      id: 'functional',
      domain: 'Functional',
      icon: 'Route',
      values: [
        { label: 'Trail-making time', value: tasks.task5?.trailBCompletionSec !== undefined ? `${tasks.task5.trailBCompletionSec}s` : 'Missing' },
        { label: 'Sequencing errors', value: tasks.task5?.sequencingErrors !== undefined ? String(tasks.task5.sequencingErrors) : 'Missing' },
        { label: 'Task completion', value: assessment ? `${taskStatus(assessment).filter((task) => task.complete).length} of 5` : 'Missing' },
        { label: 'Session quality', value: getQuality(assessment).comparable ? 'Comparable' : 'Limited' }
      ]
    }
  ];
};

export const qualityLabel = (value: string) => {
  switch (value) {
    case 'GOOD':
      return 'Good';
    case 'ADEQUATE':
      return 'Adequate';
    case 'POOR':
      return 'Poor';
    case 'FULL':
      return 'Complete';
    case 'PARTIAL':
      return 'Partial';
    case 'CLEAR':
      return 'Clear';
    case 'UNCERTAIN':
      return 'Uncertain';
    default:
      return value;
  }
};

export const formatMetric = (value: number | null | undefined, suffix = '') =>
  value === null || value === undefined || Number.isNaN(value) ? 'Missing' : `${value}${suffix}`;

export const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
