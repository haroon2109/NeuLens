import { Router } from 'express';
import { register, login, getMe, updateProfile, forgotPassword, logout } from '../controllers/auth.controller';
import {
  signup,
  verifyOtp,
  resendOtp,
  login as accountLogin,
  forgotPassword as accountForgotPassword,
  resetPassword,
  authenticateAccountToken,
  getVerificationStatus,
} from '../controllers/account.controller';
import { authenticateToken } from '../middleware/auth';
import { demoAccessEnabled } from '../services/demoAccess';

const router = Router();

// Shared role-based authentication flow (screens 08–14)
router.get('/demo-status', (_req, res) => {
  res.json({ enabled: demoAccessEnabled() });
});
router.post('/signup', signup);
router.post('/signin', accountLogin);
router.post('/verify', verifyOtp);
router.post('/resend', resendOtp);
router.post('/password/forgot', accountForgotPassword);
router.post('/password/reset', resetPassword);
router.get('/verification', authenticateAccountToken, getVerificationStatus);

// Legacy profile endpoints retained for existing clients
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.post('/forgot-password', forgotPassword);

// Clears the HttpOnly session cookie for every portal.
router.post('/logout', logout);

export default router;
