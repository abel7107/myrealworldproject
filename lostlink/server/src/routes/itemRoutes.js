import { Router } from 'express';
import { getItems, getItem, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', authenticateUser, createItem);
router.put('/:id', authenticateUser, updateItem);
router.delete('/:id', authenticateUser, deleteItem);

export default router;