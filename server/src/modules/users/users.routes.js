import express from 'express';
import { getUsers } from './users.controller.js';
import { authMiddleware, roleGuard } from '../../middleware/auth.js';

const router = express.Router();
router.get('/', authMiddleware, getUsers);
export default router;
