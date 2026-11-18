import bcrypt from 'bcryptjs';
import { accounts, type AccountRecord } from '../controllers/account.controller';
import { DEMO_CLINICIAN_USER_ID, DEMO_PATIENT_USER_ID } from './demoRecords';
import { inMemoryUsers, type UserRecord } from '../models/dataStore';

/**
 * Fictional jury accounts for the prototype.
 *
 * These are deliberately separate from real clinical accounts: the patient is a
 * made-up person and the clinician is a demo profile. Only the sign-in records
 * are seeded; no screening history, scores or sensor measurements are invented
 * for them, so both portals show exactly what has actually been measured.
 */
export const DEMO_PATIENT = {
  email: 'patient.demo@neulens.ai',
  password: 'DemoPatient2026!',
  name: 'Haroon',
  patientId: 'CV-2026-HAROON',
  pin: '246810',
};

export const DEMO_DOCTOR = {
  email: 'doctor.demo@neulens.ai',
  password: 'DemoDoctor2026!',
  name: 'Dr. Mohamed',
};

const DEMO_PATIENT_ACCOUNT_ID = 'acct_demo_patient';
const DEMO_DOCTOR_ACCOUNT_ID = 'acct_demo_doctor';

/**
 * Demo access is on by default for local and jury use. In production it must be
 * opted into explicitly, so a clinical deployment never seeds the documented
 * demo clinician by accident.
 */
export function demoAccessEnabled(): boolean {
  const flag = process.env.DEMO_ACCESS_ENABLED;
  if (flag === 'false') return false;
  if (process.env.NODE_ENV === 'production') return flag === 'true';
  return true;
}

function ensureDemoPatientUser(): UserRecord {
  const existing = inMemoryUsers.find((user) => user.id === DEMO_PATIENT_USER_ID);
  if (existing) return existing;

  const now = new Date();
  const user: UserRecord = {
    id: DEMO_PATIENT_USER_ID,
    patientId: DEMO_PATIENT.patientId,
    name: DEMO_PATIENT.name,
    email: 'haroon@demo.neulens.ai',
    // The portal uses the PIN; this random hash is only a non-login placeholder.
    passwordHash: bcrypt.hashSync(`internal-${Date.now()}-${Math.random()}`, 10),
    role: 'PATIENT',
    age: 62,
    dob: '1964-03-11',
    pinHash: bcrypt.hashSync(DEMO_PATIENT.pin, 10),
    failedLoginAttempts: 0,
    lockedUntil: null,
    gender: 'MALE',
    language: 'en',
    educationYears: 14,
    handedness: 'RIGHT',
    createdAt: now,
    updatedAt: now,
  };

  inMemoryUsers.push(user);
  return user;
}

const DEMO_DOCTOR_USER_ID = DEMO_CLINICIAN_USER_ID;

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

function ensureDemoAccount(account: AccountRecord): void {
  if (!accounts.some((entry) => entry.email === account.email)) {
    accounts.push(account);
  }
}

/**
 * Seeds the fictional sign-in accounts. Called once as the API starts.
 * The accounts are verified so the jury is not sent through OTP or approval.
 */
export function seedDemoAccess(): void {
  if (!demoAccessEnabled()) return;

  const patient = ensureDemoPatientUser();
  ensureDemoDoctorUser();

  const now = new Date();

  ensureDemoAccount({
    id: DEMO_PATIENT_ACCOUNT_ID,
    role: 'PATIENT',
    name: DEMO_PATIENT.name,
    email: DEMO_PATIENT.email,
    phone: '+971501234567',
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
    phone: '+971509876543',
    passwordHash: bcrypt.hashSync(DEMO_DOCTOR.password, 10),
    verificationStatus: 'VERIFIED',
    emailVerified: true,
    patientId: null,
    hospitalUserId: DEMO_DOCTOR_USER_ID,
    specialty: 'Neurology',
    professionalRegistrationNumber: 'DEMO-REG-2026-001',
    yearsExperience: 12,
    institutionName: 'NeuLens Clinical Demonstration',
    city: 'Abu Dhabi',
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
