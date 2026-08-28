import express from 'express';
import { getStores } from './stores.controller.js';
import { authMiddleware, roleGuard } from '../../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, getStores);
export default router;
