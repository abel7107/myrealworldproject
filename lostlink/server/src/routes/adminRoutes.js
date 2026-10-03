import { Router } from 'express';
import { getUsers, getUser, updateUserStatus, getItems, getStats, updateItemStatus } from '../controllers/adminController.js';
import { getReports, updateReport } from '../controllers/reportController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser, requireAdmin);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/status', updateUserStatus);
router.get('/items', getItems);
router.put('/items/:id/status', updateItemStatus);
router.get('/stats', getStats);
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);

export default router;