import { Router } from 'express';
import {
  getNotifications,
  getNotificationUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser);
router.get('/', getNotifications);
router.get('/unread-count', getNotificationUnreadCount);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:id/read', markNotificationRead);

export default router;
