import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { sanitizeBody } from './middleware/sanitize';
import analyzeRouter from './routes/analyze';
import verifyRouter from './routes/verify';
import reportRouter from './routes/report';
import dashboardRouter from './routes/dashboard';
import intelligenceRouter from './routes/intelligence';
import dnaRouter from './routes/dna';
import linksRouter from './routes/links';
import evidenceRouter from './routes/evidence';
import radarRouter from './routes/radar';
import coachRouter from './routes/coach';
import { connectDB } from './db/connect';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3001;
const FRONTEND_URL = process.env['FRONTEND_URL'] || 'http://localhost:5173';

// ── Security: HTTP headers ─────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── Security: CORS ─────────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// ── Security: Body size limit ──────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeBody); // strip HTML/XSS from all request bodies

// ── Security: Global rate limiter (200 req / 15 min per IP) ───────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.', status: 429 },
});
app.use(globalLimiter);

// ── Security: Stricter limiter for heavy endpoints ─────────────────
const analyzeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 min
  max: 30,                   // 30 scans per 5 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many scans. Please wait a few minutes.', status: 429 },
});

// ── Health check ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), db: 'connected' });
});

// ── Routes ─────────────────────────────────────────────────────────
app.use('/api/analyze', analyzeLimiter, analyzeRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/report', reportRouter);
app.use('/api/reports', reportRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/intelligence', intelligenceRouter);
app.use('/api/dna', analyzeLimiter, dnaRouter);
app.use('/api/links', linksRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/radar', radarRouter);
app.use('/api/coach', coachRouter);

// ── Global error handler ───────────────────────────────────────────
app.use(errorHandler);

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`ScamShield API running on http://localhost:${PORT}`);
    console.log(`CORS origin: ${FRONTEND_URL}`);
    console.log(`Security: helmet + rate-limiting enabled`);
  });
})();

export default app;
