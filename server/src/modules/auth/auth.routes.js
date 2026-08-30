import express from 'express';
import { register, login, logout, updatePassword } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/password', authMiddleware, updatePassword);

export default router;
