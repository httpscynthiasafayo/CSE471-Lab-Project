// app/api/index.js
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

// --- Middleware ---
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- DB ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abroadease';
mongoose.set('strictQuery', true);
await mongoose.connect(MONGODB_URI);
console.log('✅ MongoDB connected');

// --- Routes (IMPORT EACH ONCE) ---
import authRoutes from './routes/auth.js';
import landownerAuthRoutes from './routes/landownerAuth.js';
import userRoutes from './routes/user.js';          // <-- only once
import postRoutes from './routes/post.js';
import universityRoutes from './routes/university.js';
import propertyRoutes from './routes/property.js';
import bookmarkRoutes from './routes/bookmark.js';
import notificationRoutes from './routes/notification.js';
import adminRoutes from './routes/admin.js';
// (optional) if you created contactRequest routes earlier:
// import contactRequestRoutes from './routes/contactRequest.js';

// --- Health ---
app.get('/health', (_req, res) => res.json({ ok: true }));

// --- Mount (EACH ONCE) ---
app.use('/api/auth', authRoutes);
app.use('/api/landowner-auth', landownerAuthRoutes);
app.use('/api/me', userRoutes);                     // <-- only once
app.use('/api/posts', postRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
// if you have it:
// app.use('/api', contactRequestRoutes);

// 404
app.use((req, res, next) => {
  if (req.path === '/favicon.ico') return next();
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('🔥 Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

export default app;
