import bcrypt from 'bcryptjs';
import { accounts, type AccountRecord } from '../controllers/account.controller';
import {
  inMemoryAssessments,
  inMemoryUsers,
  type AssessmentRecord,
  type UserRecord,
} from '../models/dataStore';

/**
 * Fictional jury accounts for the prototype.
 *
 * These are deliberately separate from real clinical accounts: the patient is a
 * made-up person with made-up screening history, and the clinician is a demo
 * profile. No real patient data is used or implied.
 */
export const DEMO_PATIENT = {
  email: 'patient.demo@neulens.ai',
  password: 'DemoPatient2026!',
  name: 'Margaret Ellis',
  patientId: 'CV-2026-DEMO01',
  pin: '246810',
};

export const DEMO_DOCTOR = {
  email: 'doctor.demo@neulens.ai',
  password: 'DemoDoctor2026!',
  name: 'Dr. Amara Okafor',
};

const DEMO_PATIENT_USER_ID = 'demo-patient-margaret-ellis';
const DEMO_PATIENT_ACCOUNT_ID = 'acct_demo_patient';
const DEMO_DOCTOR_ACCOUNT_ID = 'acct_demo_doctor';

/** Demo access is on for local/demo deployments unless explicitly disabled. */
export function demoAccessEnabled(): boolean {
  return process.env.DEMO_ACCESS_ENABLED !== 'false';
}

function ensureDemoPatientUser(): UserRecord {
  const existing = inMemoryUsers.find((user) => user.id === DEMO_PATIENT_USER_ID);
  if (existing) return existing;

  const now = new Date();
  const user: UserRecord = {
    id: DEMO_PATIENT_USER_ID,
    patientId: DEMO_PATIENT.patientId,
    name: DEMO_PATIENT.name,
    email: 'margaret.ellis@demo.neulens.ai',
    // The portal uses the PIN; this random hash is only a non-login placeholder.
    passwordHash: bcrypt.hashSync(`internal-${Date.now()}-${Math.random()}`, 10),
    role: 'PATIENT',
    age: 72,
    dob: '1954-03-11',
    pinHash: bcrypt.hashSync(DEMO_PATIENT.pin, 10),
    failedLoginAttempts: 0,
    lockedUntil: null,
    gender: 'FEMALE',
    language: 'en',
    educationYears: 14,
    handedness: 'RIGHT',
    createdAt: now,
    updatedAt: now,
  };

  inMemoryUsers.push(user);
  return user;
}

const DEMO_DOCTOR_USER_ID = 'demo-clinician-amara-okafor';

/**
 * The doctor portal signs in against the clinical user table, while the shared
 * account endpoint uses its own account store. Seed the demo clinician into
 * both so the documented demo credentials work from either portal.
 */
function ensureDemoDoctorUser(): UserRecord {
  const existing = inMemoryUsers.find((user) => user.id === DEMO_DOCTOR_USER_ID);
  if (existing) return existing;

  const now = new Date();
  const user: UserRecord = {
    id: DEMO_DOCTOR_USER_ID,
    patientId: null,
    name: DEMO_DOCTOR.name,
    email: DEMO_DOCTOR.email,
    passwordHash: bcrypt.hashSync(DEMO_DOCTOR.password, 10),
    role: 'CLINICIAN',
    age: 0,
    gender: 'PREFER_NOT_TO_SAY',
    language: 'en',
    educationYears: null,
    handedness: null,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryUsers.push(user);
  return user;
}

function demoAssessment(
  id: string,
  date: Date,
  overallScore: number,
  riskLevel: string,
  reviewStatus: string,
  activities: Record<string, number>,
  sleep: number
): AssessmentRecord {
  const functionalCheckIn = {
    completedAt: date.toISOString(),
    activities: {
      appointments: activities.appointments ?? 0,
      medication: activities.medication ?? 0,
      finances: activities.finances ?? 0,
      household: activities.household ?? 0,
    },
    contextFactors: { sleep, activity: 0, moodStress: 0 },
    assessmentContext: {
      language: 'en',
      ageYears: 72,
      educationYears: 14,
      taskVersion: 'v2.4',
      accessibility: { vision: 0, hearing: 0, motor: 0, digitalFamiliarity: 0 },
    },
  };

  return {
    id,
    userId: DEMO_PATIENT_USER_ID,
    date,
    overallScore,
    riskLevel,
    status: 'COMPLETED',
    reviewStatus,
    reviewedBy: reviewStatus === 'PENDING_REVIEW' ? null : DEMO_DOCTOR.name,
    reviewedAt: reviewStatus === 'PENDING_REVIEW' ? null : new Date(date.getTime() + 24 * 60 * 60 * 1000),
    taskResponses: {
      mode: 'DEMO',
      functionalCheckIn,
    },
    eyeMetrics: { reactionTime: 0.62, blinkRate: 15.4, fixationScore: 86 },
    voiceMetrics: { speechRate: 4.3, pauseScore: 18, jitter: 0.42, shimmer: 2.1 },
    faceMetrics: { symmetry: 92, tremorScore: 6 },
    report: {
      id: `demo-report-${id}`,
      recommendation:
        'Prototype demonstration record. Supports a clinical conversation and follow-up; not a diagnosis.',
      doctorNotes: reviewStatus === 'PENDING_REVIEW' ? '' : 'Reviewed in the demonstration workspace.',
    },
  };
}

function ensureDemoHistory(): void {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const seeded: AssessmentRecord[] = [
    demoAssessment(
      'demo-assessment-latest',
      new Date(now - 45 * 60 * 1000),
      69,
      'MODERATE',
      'PENDING_REVIEW',
      { appointments: 1, medication: 1, finances: 1, household: 0 },
      1
    ),
    demoAssessment(
      'demo-assessment-35d',
      new Date(now - 35 * day),
      76,
      'LOW',
      'REVIEWED',
      { appointments: 0, medication: 0, finances: 0, household: 1 },
      0
    ),
    demoAssessment(
      'demo-assessment-95d',
      new Date(now - 95 * day),
      80,
      'LOW',
      'REVIEWED',
      { appointments: 0, medication: 0, finances: 0, household: 0 },
      0
    ),
    demoAssessment(
      'demo-assessment-155d',
      new Date(now - 155 * day),
      82,
      'LOW',
      'REVIEWED',
      { appointments: 0, medication: 0, finances: 0, household: 0 },
      0
    ),
  ];

  for (const assessment of seeded) {
    if (!inMemoryAssessments.some((entry) => entry.id === assessment.id)) {
      inMemoryAssessments.push(assessment);
    }
  }
}

function ensureDemoAccount(account: AccountRecord): void {
  if (!accounts.some((entry) => entry.email === account.email)) {
    accounts.push(account);
  }
}

/**
 * Seeds fictional accounts and history. Called once as the API starts.
 * The accounts are verified so the jury is not sent through OTP or approval.
 */
export function seedDemoAccess(): void {
  if (!demoAccessEnabled()) return;

  const patient = ensureDemoPatientUser();
  ensureDemoDoctorUser();
  ensureDemoHistory();

  const now = new Date();

  ensureDemoAccount({
    id: DEMO_PATIENT_ACCOUNT_ID,
    role: 'PATIENT',
    name: DEMO_PATIENT.name,
    email: DEMO_PATIENT.email,
    phone: '+919876500001',
    passwordHash: bcrypt.hashSync(DEMO_PATIENT.password, 10),
    verificationStatus: 'VERIFIED',
    emailVerified: true,
    patientId: DEMO_PATIENT.patientId,
    hospitalUserId: patient.id,
    language: 'en',
    createdAt: now,
    updatedAt: now,
  });

  ensureDemoAccount({
    id: DEMO_DOCTOR_ACCOUNT_ID,
    role: 'CLINICIAN',
    name: DEMO_DOCTOR.name,
    email: DEMO_DOCTOR.email,
    phone: '+919876500002',
    passwordHash: bcrypt.hashSync(DEMO_DOCTOR.password, 10),
    verificationStatus: 'VERIFIED',
    emailVerified: true,
    patientId: null,
    hospitalUserId: DEMO_DOCTOR_USER_ID,
    specialty: 'Neurology',
    professionalRegistrationNumber: 'DEMO-REG-2026-001',
    yearsExperience: 12,
    institutionName: 'NeuLens Clinical Demonstration',
    city: 'Bengaluru',
    language: 'en',
    createdAt: now,
    updatedAt: now,
  });

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[NeuLens Demo]: Jury demo access is enabled in production. Set DEMO_ACCESS_ENABLED=false for a clinical deployment.'
    );
  }
}
