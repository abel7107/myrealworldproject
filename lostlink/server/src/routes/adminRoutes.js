import { Router } from 'express';
import { getUsers, getUser, updateUserStatus, getItems, getStats } from '../controllers/adminController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser, requireAdmin);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/status', updateUserStatus);
router.get('/items', getItems);
router.get('/stats', getStats);

export default router;