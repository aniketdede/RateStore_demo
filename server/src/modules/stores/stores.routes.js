import express from 'express';
import { getStores, getMyStore } from './stores.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();
router.get('/my', authMiddleware, getMyStore);
router.get('/', authMiddleware, getStores);
export default router;
