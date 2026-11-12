import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { ComplianceController } from '../controllers/compliance.controller';
import { AppointmentController } from '../controllers/appointment.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public patient portal entry points
router.post('/register', PatientController.register);
router.post('/login', PatientController.login);

// Protected patient session endpoints
router.get('/session', authenticateToken, PatientController.getSession);
router.get('/assessments', authenticateToken, PatientController.listAssessments);
router.post('/assessment/submit', authenticateToken, PatientController.submitAssessment);
router.get('/confirmation-card', authenticateToken, PatientController.getConfirmationCard);

// Consent records and appointments are persisted server-side
router.post('/consent', authenticateToken, ComplianceController.recordConsent);
router.get('/consent', authenticateToken, ComplianceController.listConsents);
router.post('/consent/withdraw', authenticateToken, ComplianceController.withdrawConsent);
router.get('/appointments', authenticateToken, AppointmentController.listForPatient);
router.patch('/appointments/:id', authenticateToken, AppointmentController.updateForPatient);

export default router;
