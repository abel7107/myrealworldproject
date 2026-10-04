import { Router } from 'express';
import { updateClaimStatus } from '../controllers/claimController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.patch('/:id/status', authenticateUser, updateClaimStatus);

export default router;
