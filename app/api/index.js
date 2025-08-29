import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- Stripe Routes ---
import stripeRoutes from './routes/stripe.js';
app.use('/backend/stripe', stripeRoutes);

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

// Other routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import universityRoutes from './routes/university.js';
import propertyRoutes from './routes/property.js';
import bookmarkRoutes from './routes/bookmark.js';
import notificationRoutes from './routes/notification.js';
import adminRoutes from './routes/admin.js';
import testRoutes from './routes/test.js';

// --- Health ---
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/me', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', testRoutes);

export default app;
