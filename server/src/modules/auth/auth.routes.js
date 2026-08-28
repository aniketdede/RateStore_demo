import express from 'express';
import { register, login, updatePassword } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/password', authMiddleware, updatePassword);

export default router;
