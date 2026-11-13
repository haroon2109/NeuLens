export type DemoRole = 'patient' | 'doctor';

export const DEMO_ACCOUNTS = {
  patient: {
    email: 'patient.demo@neulens.ai',
    password: 'DemoPatient2026!',
    name: 'Margaret Ellis',
    patientId: 'CV-2026-DEMO01',
    pin: '246810',
  },
  doctor: {
    email: 'doctor.demo@neulens.ai',
    password: 'DemoDoctor2026!',
    name: 'Dr. Amara Okafor',
  },
} as const;
