import express from 'express';
import { upsertRating, getMyRatingForStore, getRatingsForStore } from './ratings.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();
router.post('/:storeId', authMiddleware, upsertRating);
router.get('/:storeId/my', authMiddleware, getMyRatingForStore);
router.get('/:storeId', authMiddleware, getRatingsForStore);
export default router;
