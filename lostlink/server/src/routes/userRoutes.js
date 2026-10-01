import { Router } from 'express';
import { getMe, updateMe } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', authenticateUser, getMe);
router.put('/me', authenticateUser, updateMe);

export default router;