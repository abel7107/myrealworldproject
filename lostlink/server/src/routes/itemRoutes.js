import { Router } from 'express';
import { getItems, getItem, createItem, updateItem, updateItemStatus, deleteItem } from '../controllers/itemController.js';
import { createReport } from '../controllers/reportController.js';
import { createClaim, getClaimsForItem } from '../controllers/claimController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

import { uploadItemImage } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', authenticateUser, uploadItemImage, createItem);
router.post('/:id/report', authenticateUser, createReport);
router.post('/:id/claims', authenticateUser, createClaim);
router.get('/:id/claims', authenticateUser, getClaimsForItem);
router.put('/:id', authenticateUser, uploadItemImage, updateItem);
router.patch('/:id/status', authenticateUser, updateItemStatus);
router.delete('/:id', authenticateUser, deleteItem);

export default router;