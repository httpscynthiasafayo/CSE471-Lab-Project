import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from "body-parser";

import bcrypt from 'bcryptjs';

const app = express();

// --- Middleware ---
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));


// --- Stripe Routes ---
import stripeRoutes from './routes/stripe.js';
app.use('/api/stripe', stripeRoutes);

// Import User model for admin creation
import User from './models/User.js';

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@abroadease.com';
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(defaultAdminPassword, 10);

    await User.create({
      name: 'Administrator',
      email: defaultAdminEmail,
      passwordHash,
      role: 'admin',
    });

    console.log('Default admin user created successfully!');
    console.log('Email:', defaultAdminEmail);
    console.log('Password:', defaultAdminPassword);
    console.log('Please change the password after first login!');
  } catch (error) {
    console.error('Error creating default admin user:', error.message);
  }
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await createDefaultAdmin();
  })
  .catch(err => console.error(err));
// // --- DB ---
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abroadease';
// mongoose.set('strictQuery', true);
// await mongoose.connect(MONGODB_URI);
// console.log('✅ MongoDB connected');

// --- Routes (IMPORT EACH ONCE) ---

// Other routes
import authRoutes from './routes/auth.js';
import landownerAuthRoutes from './routes/landownerAuth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import universityRoutes from './routes/university.js';
import propertyRoutes from './routes/property.js';
import bookmarkRoutes from './routes/bookmark.js';
import notificationRoutes from './routes/notification.js';
import adminRoutes from './routes/admin.js';
import testRoutes from './routes/test.js';
import path from 'path';
import meRouter from './routes/user.js';
import visaRoutes from './routes/visa.js';

// --- Health ---
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/landowner-auth', landownerAuthRoutes);
app.use('/api/me', userRoutes);                     // <-- only once
app.use('/api/posts', postRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', testRoutes);
app.use('/api/visas', visaRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/me', meRouter);

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
