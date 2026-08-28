import express from 'express';
import { getDashboardStats, addUser, addStore } from './admin.controller.js';
import { authMiddleware, roleGuard } from '../../middleware/auth.js';

const router = express.Router();
router.get('/dashboard', authMiddleware, roleGuard('ADMIN'), getDashboardStats);
router.post('/users', authMiddleware, roleGuard('ADMIN'), addUser);
router.post('/stores', authMiddleware, roleGuard('ADMIN'), addStore);
export default router;
