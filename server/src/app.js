import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './modules/auth/auth.routes.js';
import storeRoutes from './modules/stores/stores.routes.js';
import userRoutes from './modules/users/users.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import ratingRoutes from './modules/ratings/ratings.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS: allow the configured client origin (and localhost dev) with credentials.
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    // allow same-origin/non-browser (no Origin) and any explicitly allowed origin
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, true); // permissive for assessment; restrict in production
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Diagnostic logging: see exactly what auth material reaches the API (helps with proxies/gateways).
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const hasBearer = (req.headers.authorization || '').startsWith('Bearer ');
    const hasCookie = !!(req.cookies && req.cookies.token);
    res.on('finish', () => {
      console.log(`[req] ${req.method} ${req.path} -> ${res.statusCode} | bearer:${hasBearer ? 'Y' : 'n'} cookie:${hasCookie ? 'Y' : 'n'} origin:${req.headers.origin || '-'}`);
    });
  }
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString(), phase: 'phase-1-auth' }));

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`RateStore API listening on ${PORT} | Phase 1 Auth + Validators ready`));
