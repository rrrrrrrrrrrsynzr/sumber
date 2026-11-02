import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { closeDatabase, countFeedback, listFeedback, saveFeedback } from './database.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');
const buildDirectory = path.join(projectRoot, 'dist');
const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const validCategories = new Set(['Saran', 'Pertanyaan', 'Apresiasi']);
const adminUsername = process.env.ADMIN_USERNAME || '';
const adminPassword = process.env.ADMIN_PASSWORD || '';

if (process.env.TRUST_PROXY === 'true') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: '12kb', type: 'application/json' }));

const publicFeedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan. Coba lagi beberapa saat.' },
});

function safeText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function verifyBasicCredentials(req) {
  if (!adminUsername || !adminPassword) return false;
  const [scheme, encoded] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Basic' || !encoded) return false;

  let decoded;
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return false;
  }
  const separator = decoded.indexOf(':');
  if (separator < 0) return false;
  const suppliedUsername = decoded.slice(0, separator);
  const suppliedPassword = decoded.slice(separator + 1);
  const digest = (value) => crypto.createHash('sha256').update(value).digest();
  return crypto.timingSafeEqual(digest(suppliedUsername), digest(adminUsername))
    && crypto.timingSafeEqual(digest(suppliedPassword), digest(adminPassword));
}

function requireAdmin(req, res, next) {
  if (!adminUsername || !adminPassword) {
    return res.status(503).json({ error: 'Akses halaman dev belum dikonfigurasi oleh administrator.' });
  }
  if (!verifyBasicCredentials(req)) {
    res.set('WWW-Authenticate', 'Basic realm="Pradnyasiwi Dev", charset="UTF-8"');
    return res.status(401).json({ error: 'Autentikasi diperlukan.' });
  }
  return next();
}

function sameOriginOnly(req, res, next) {
  const origin = req.get('origin');
  if (!origin) return next();
  const expectedOrigin = `${req.protocol}://${req.get('host')}`;
  if (origin !== expectedOrigin) return res.status(403).json({ error: 'Asal permintaan tidak diizinkan.' });
  return next();
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/feedback', publicFeedbackLimiter, sameOriginOnly, (req, res) => {
  const name = safeText(req.body?.name, 40) || 'Pengunjung';
  const category = safeText(req.body?.category, 24);
  const message = safeText(req.body?.message, 500);
  const rating = Number(req.body?.rating);

  if (!validCategories.has(category)) return res.status(400).json({ error: 'Pilih jenis masukan yang tersedia.' });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: 'Penilaian harus antara 1 dan 5.' });
  if (message.length < 10 || message.length > 500) return res.status(400).json({ error: 'Masukan harus berisi 10–500 karakter.' });

  const feedback = saveFeedback({ name, category, rating, message });
  return res.status(201).json({ message: 'Masukan berhasil disimpan.', feedback: { id: feedback.id } });
});

app.get('/api/admin/feedback', requireAdmin, (_req, res) => {
  res.set('Cache-Control', 'no-store');
  return res.json({ total: countFeedback(), feedback: listFeedback(1000) });
});

app.get('/dev/feedback', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  return res.sendFile(path.join(buildDirectory, 'index.html'));
});

app.use(express.static(buildDirectory, {
  extensions: ['html'],
  index: 'index.html',
  maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
}));

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
  return res.sendFile(path.join(buildDirectory, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Format JSON tidak valid.' });
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Permintaan terlalu besar.' });
  console.error(error);
  return res.status(500).json({ error: 'Terjadi kesalahan server.' });
});

const server = app.listen(port, host, () => {
  console.log(`Pradnyasiwi Quadtech listening on http://${host}:${port}`);
  console.log(`Feedback storage: ${process.env.FEEDBACK_DB_PATH || './data/feedback.sqlite'}`);
  if (!adminUsername || !adminPassword) console.warn('Admin feedback is disabled until ADMIN_USERNAME and ADMIN_PASSWORD are set.');
});

function shutdown() {
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
