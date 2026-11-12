import { Router } from 'express';
import authRoutes from './auth.routes';
import screeningRoutes from './screening.routes';
import analyticsRoutes from './analytics.routes';
import voiceRoutes from './voice.routes';
import patientRoutes from './patient.routes';
import doctorRoutes from './doctor.routes';
import baselineRoutes from './baseline.routes';
import longitudinalRoutes from './longitudinal.routes';
import changeDetectionRoutes from './changedetection.routes';
import contextInputRoutes from './contextinput.routes';
import brainHealthRoutes from './brainhealth.routes';
import assessmentCompleteRoutes from './assessmentcomplete.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/screenings', screeningRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/voice', voiceRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);

// New architecture endpoints — baseline, longitudinal, change detection, context inputs, brain health
router.use('/baseline', baselineRoutes);
router.use('/longitudinal', longitudinalRoutes);
router.use('/change-detection', changeDetectionRoutes);
router.use('/context-inputs', contextInputRoutes);
router.use('/brain-health', brainHealthRoutes);

// Complete assessment submission endpoint
router.use('/patient/assessment', assessmentCompleteRoutes);

export default router;
