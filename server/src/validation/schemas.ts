import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required'),
  age: z.number().int().min(0, 'Age must be positive'),
  gender: z.string().min(1, 'Gender is required'),
  language: z.string().min(1, 'Language is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSetupSchema = z.object({
  age: z.number().int().min(0),
  gender: z.string(),
  language: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const screeningSubmitSchema = z.object({
  overallScore: z.number().min(0).max(100),
  riskLevel: z.string(),
  reactionTime: z.number(),
  blinkRate: z.number(),
  fixationScore: z.number(),
  speechRate: z.number(),
  pauseScore: z.number(),
  jitter: z.number(),
  shimmer: z.number(),
  symmetry: z.number(),
  tremorScore: z.number(),
  recommendation: z.string(),
  doctorNotes: z.string().optional(),
});

export const patientRegisterSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z.number().int().min(1).max(120, 'Please enter a valid age'),
  dob: z.string().optional(),
  gender: z.string().default('PREFER_NOT_TO_SAY'),
  language: z.string().default('en'),
  educationYears: z.number().int().min(0).max(30).optional().default(12),
  handedness: z.string().optional().default('RIGHT'),
  pin: z.string().regex(/^\d{4,8}$/, 'PIN must be 4 to 8 digits'),
});

export const patientLoginSchema = z.object({
  patientId: z.string().trim().min(4, 'Patient ID is required'),
  // Only the PIN authenticates a patient. DOB, age and birth year are public
  // identifiers and are deliberately not accepted here.
  verification: z.string().trim().regex(/^\d{4,8}$/, 'Enter the PIN on your Patient ID card'),
});

const functionalCheckInSchema = z.union([
  z.object({
    skipped: z.literal(true),
    completedAt: z.string().datetime()
  }).strict(),
  z.object({
    completedAt: z.string().datetime(),
    activities: z.object({
      appointments: z.number().int().min(0).max(2),
      medication: z.number().int().min(0).max(2),
      finances: z.number().int().min(0).max(2),
      household: z.number().int().min(0).max(2)
    }).strict()
  }).strict(),
  z.object({
    completedAt: z.string().datetime(),
    contextFactors: z.object({
      sleep: z.number().int().min(0).max(2),
      activity: z.number().int().min(0).max(2),
      moodStress: z.number().int().min(0).max(2)
    }).strict(),
    assessmentContext: z.object({
      language: z.enum(['en', 'ta', 'hi', 'te', 'ml', 'kn']),
      ageYears: z.number().int().min(0).max(120).nullable(),
      educationYears: z.number().int().min(0).max(30).nullable(),
      taskVersion: z.string().min(1).max(50),
      accessibility: z.object({
        vision: z.number().int().min(0).max(2),
        hearing: z.number().int().min(0).max(2),
        motor: z.number().int().min(0).max(2),
        digitalFamiliarity: z.number().int().min(0).max(2)
      }).strict()
    }).strict(),
    activities: z.object({
      appointments: z.number().int().min(0).max(2),
      medication: z.number().int().min(0).max(2),
      finances: z.number().int().min(0).max(2),
      household: z.number().int().min(0).max(2)
    }).strict()
  }).strict()
]);

const externalContextConsentSchema = z.object({
  granted: z.boolean(),
  recordedAt: z.string().datetime()
}).strict();

const taskResponsesSchema = z.record(z.any()).superRefine((responses, context) => {
  const checkIn = responses.functionalCheckIn === undefined
    ? null
    : functionalCheckInSchema.safeParse(responses.functionalCheckIn);
  if (checkIn && !checkIn.success) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['functionalCheckIn'],
      message: 'Functional check-in responses are invalid'
    });
  }
  if (responses.externalContextConsent !== undefined &&
      !externalContextConsentSchema.safeParse(responses.externalContextConsent).success) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['externalContextConsent'],
      message: 'External context consent record is invalid'
    });
  }
});

export const patientSubmitAssessmentSchema = z.object({
  patientId: z.string().optional(),
  overallScore: z.number().min(0).max(100),
  riskLevel: z.string(),
  reactionTime: z.number().default(250),
  blinkRate: z.number().default(14),
  fixationScore: z.number().default(85),
  speechRate: z.number().default(130),
  pauseScore: z.number().default(88),
  jitter: z.number().default(0.12),
  shimmer: z.number().default(1.2),
  symmetry: z.number().default(94),
  tremorScore: z.number().default(10),
  taskResponses: taskResponsesSchema.optional(),
  recommendation: z.string().optional().default('Cognitive screening completed. Clinical review pending.'),
});

export const consentRecordSchema = z.object({
  version: z.string().min(1).max(64),
  scopes: z.record(z.boolean()),
});

export const consentWithdrawSchema = z.object({
  reason: z.string().max(500).optional().default(''),
});

export const appointmentCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  type: z.enum(['FOLLOW_UP', 'REPEAT_ASSESSMENT', 'RESULTS_REVIEW', 'TELEHEALTH']).default('FOLLOW_UP'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Appointment date must be YYYY-MM-DD'),
  time: z.string().trim().min(1).max(20),
  location: z.string().max(200).optional().default(''),
  communication: z.string().max(200).optional().default(''),
  assessmentId: z.string().optional().nullable(),
});

export const appointmentUpdateSchema = z.object({
  status: z.enum(['UPCOMING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().trim().min(1).max(20).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'Provide at least one appointment field to update',
});

export const doctorReviewSchema = z.object({
  reviewStatus: z.enum(['PENDING_REVIEW', 'REVIEWED', 'FOLLOWUP_REQUIRED']),
  doctorNotes: z.string().max(3000).optional(),
});

export const doctorCarePlanSchema = z.object({
  action: z.enum(['REPEAT_SCREENING', 'CLINICAL_REVIEW', 'REVIEW_CONTEXT', 'SUPPORT_FUNCTION']),
  followUpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  notes: z.string().max(2000).default(''),
  // Full clinician-approved plan, stored as entered for audit and display.
  plan: z.record(z.any()).optional()
});

export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>;
export type PatientLoginInput = z.infer<typeof patientLoginSchema>;
export type PatientSubmitAssessmentInput = z.infer<typeof patientSubmitAssessmentSchema>;
export type DoctorReviewInput = z.infer<typeof doctorReviewSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ScreeningSubmitInput = z.infer<typeof screeningSubmitSchema>;
