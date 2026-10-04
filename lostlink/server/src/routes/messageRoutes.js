import { Router } from 'express';
import {
  sendMessage,
  getConversations,
  getConversation,
  markMessageAsRead,
  markConversationAsRead,
  deleteMessage,
  getUnreadCount,
} from '../controllers/messageController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// Every messaging route requires authentication
router.use(authenticateUser);

router.get('/unread-count', getUnreadCount);
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId', getConversation);
router.patch('/conversations/:conversationId/read', markConversationAsRead);
router.post('/', sendMessage);
router.patch('/:id/read', markMessageAsRead);
router.delete('/:id', deleteMessage);

export default router;
