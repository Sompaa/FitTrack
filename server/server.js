// ================================================================
// server.js — FitTrack Entry Point
// ================================================================
// This file starts the Express web server. It:
//   1. Connects to MongoDB
//   2. Registers middleware (security, parsing, rate-limiting)
//   3. Mounts all API route groups under /api/
//   4. Serves the frontend (public/) as static files
//   5. Falls back to index.html for any unknown URL (SPA support)
// ================================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); // Load .env variables into process.env

const app = express();

// ----------------------------------------------------------------
// 1. DATABASE CONNECTION
// ----------------------------------------------------------------
// We connect once at startup. If it fails the process exits — there
// is no point running an API server without a database.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// ----------------------------------------------------------------
// 2. MIDDLEWARE
// ----------------------------------------------------------------

// CORS — controls which origins (domains) may send requests to the API.
// In production set CLIENT_URL to your real domain.
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Parse incoming JSON request bodies (e.g. { "email": "..." })
app.use(express.json());
// Parse URL-encoded form bodies (for HTML forms)
app.use(express.urlencoded({ extended: true }));

// Rate limiting — prevents abuse by capping each IP to 100 requests per 15 minutes.
// Applies only to /api/ routes so static file serving is unaffected.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100
});
app.use('/api/', limiter);

// ----------------------------------------------------------------
// 3. STATIC FILES (the frontend)
// ----------------------------------------------------------------
// Everything in /public (HTML, CSS, JS) is served directly by Express.
// No separate frontend server is needed.
app.use(express.static(path.join(__dirname, '../public')));

// ----------------------------------------------------------------
// 4. API ROUTES
// ----------------------------------------------------------------
// Each require() loads a router file that groups related endpoints.
// The protect middleware in each router enforces JWT authentication.
app.use('/api/auth',      require('./src/routes/authRoutes'));      // login, register
app.use('/api/users',     require('./src/routes/userRoutes'));      // profile, stats
app.use('/api/weight',    require('./src/routes/weightRoutes'));    // weight logging
app.use('/api/workouts',  require('./src/routes/workoutRoutes'));   // workouts & logs
app.use('/api/recipes',   require('./src/routes/recipeRoutes'));    // recipe browser
app.use('/api/locations', require('./src/routes/locationRoutes')); // nearby gyms/parks
app.use('/api/weather',   require('./src/routes/weatherRoutes'));   // weather recommendations
app.use('/api/admin',     require('./src/routes/adminRoutes'));     // admin dashboard

// Simple health check — useful for uptime monitors and debugging
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitTrack API is running' });
});

// ----------------------------------------------------------------
// 5. SPA FALLBACK
// ----------------------------------------------------------------
// For any URL that is NOT an /api/ route (e.g. /#dashboard, /#recipes),
// return index.html. The browser-side router then handles the hash.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ----------------------------------------------------------------
// 6. GLOBAL ERROR HANDLER
// ----------------------------------------------------------------
// If any route handler calls next(err), this middleware catches it
// and returns a consistent JSON error response.
app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ----------------------------------------------------------------
// START SERVER
// ----------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
