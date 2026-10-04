import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateUser, getMe);

export default router;