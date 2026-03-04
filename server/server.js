require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { sequelize } = require('./config/db');
require('./models'); // register all Sequelize models & associations

const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const quizRoutes = require('./routes/quizRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security & request parsing ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ── Start: sync DB then listen ────────────────────────────────────────────────
sequelize
  .authenticate()
  .then(() => sequelize.sync())          // create tables if not present
  .then(() => {
    app.listen(PORT, () => console.log(`✅  Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌  DB connection failed:', err.message);
    process.exit(1);
  });