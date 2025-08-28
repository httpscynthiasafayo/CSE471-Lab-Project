import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import LandownerVerificationRequest from '../models/LandownerVerificationRequest.js';
import uploadLandownerDocument from '../middleware/uploadLandownerDocument.js';
import auth from '../middleware/requireAuth.js';

const router = express.Router();

// Landowner registration with document upload
router.post('/register', uploadLandownerDocument.single('propertyDocument'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Property ownership document is required' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create landowner user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'landowner',
      propertyOwnershipDocumentUrl: req.file.path,
      isLandownerVerified: false
    });

    // Create verification request
    await LandownerVerificationRequest.create({
      userId: user._id,
      propertyOwnershipDocumentUrl: req.file.path,
      status: 'pending'
    });

    res.json({
      message: 'Landowner registration successful. Your verification request has been submitted.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isLandownerVerified: user.isLandownerVerified
      }
    });
  } catch (error) {
    console.error('Landowner registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Landowner login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, role: 'landowner' });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isLandownerVerified) {
      return res.status(403).json({ 
        error: 'Your landowner account is not yet verified. Please wait for admin approval.',
        needsVerification: true
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true }).json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isLandownerVerified: user.isLandownerVerified
      }
    });
  } catch (error) {
    console.error('Landowner login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Request verification (for existing landowners who haven't been verified)
router.post('/request-verification', auth, uploadLandownerDocument.single('propertyDocument'), async (req, res) => {
  try {
    if (req.user.role !== 'landowner') {
      return res.status(403).json({ error: 'Only landowners can request verification' });
    }

    if (req.user.isLandownerVerified) {
      return res.status(400).json({ error: 'You are already verified' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Property ownership document is required' });
    }

    // Check if there's already a pending request
    const existingRequest = await LandownerVerificationRequest.findOne({
      userId: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending verification request' });
    }

    // Update user's document URL
    await User.findByIdAndUpdate(req.user.id, {
      propertyOwnershipDocumentUrl: req.file.path
    });

    // Create new verification request
    await LandownerVerificationRequest.create({
      userId: req.user.id,
      propertyOwnershipDocumentUrl: req.file.path,
      status: 'pending'
    });

    res.json({ message: 'Verification request submitted successfully' });
  } catch (error) {
    console.error('Verification request error:', error);
    res.status(500).json({ error: 'Failed to submit verification request' });
  }
});

export default router;

