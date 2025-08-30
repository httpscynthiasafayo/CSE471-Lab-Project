// routes/admin.js
import express from 'express';
import User from '../models/User.js';
import LandownerVerificationRequest from '../models/LandownerVerificationRequest.js';
import auth from '../middleware/requireAuth.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all pending landowner verification requests
router.get('/landowner-verification-requests', auth, requireAdmin, async (req, res) => {
  try {
    const requests = await LandownerVerificationRequest.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ requestedAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching verification requests:', error);
    res.status(500).json({ error: 'Failed to fetch verification requests' });
  }
});

// Get all landowner verification requests (including approved/rejected)
router.get('/landowner-verification-requests/all', auth, requireAdmin, async (req, res) => {
  try {
    const requests = await LandownerVerificationRequest.find()
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ requestedAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all verification requests:', error);
    res.status(500).json({ error: 'Failed to fetch verification requests' });
  }
});

// New route to serve the landowner document for viewing
router.get('/landowner-documents/:requestId', auth, requireAdmin, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await LandownerVerificationRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Verification request not found' });
    }

    const user = await User.findById(request.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const documentPath = user.propertyOwnershipDocumentUrl;
    if (!documentPath) {
        return res.status(404).json({ error: 'Document URL not found for this user' });
    }
    
    const absolutePath = path.resolve(documentPath);
    
    if (fs.existsSync(absolutePath)) {
      res.sendFile(absolutePath);
    } else {
      res.status(404).json({ error: 'Document file not found on the server.' });
    }
  } catch (error) {
    console.error('Error serving landowner document:', error);
    res.status(500).json({ error: 'Failed to retrieve document.' });
  }
});


// Approve landowner verification request
router.post('/landowner-verification-requests/:requestId/approve', auth, requireAdmin, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminNotes } = req.body;

    const request = await LandownerVerificationRequest.findById(requestId)
      .populate('userId', 'name email');
    
    if (!request) {
      return res.status(404).json({ error: 'Verification request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request has already been processed' });
    }

    // Update verification request
    await LandownerVerificationRequest.findByIdAndUpdate(requestId, {
      status: 'approved',
      adminNotes,
      reviewedAt: new Date(),
      reviewedBy: req.user.id
    });

    // Update user to verified status
    await User.findByIdAndUpdate(request.userId._id, {
      isLandownerVerified: true
    });

    // Send approval email
    try {
      const { sendLandownerApprovalEmail } = await import('../services/emailService.js');
      await sendLandownerApprovalEmail(request.userId.email, request.userId.name);
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the approval if email fails
    }

    res.json({ message: 'Landowner verification approved successfully' });
  } catch (error) {
    console.error('Error approving verification:', error);
    res.status(500).json({ error: 'Failed to approve verification' });
  }
});

// Reject landowner verification request
router.post('/landowner-verification-requests/:requestId/reject', auth, requireAdmin, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminNotes } = req.body;

    const request = await LandownerVerificationRequest.findById(requestId)
      .populate('userId', 'name email');
    
    if (!request) {
      return res.status(404).json({ error: 'Verification request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request has already been processed' });
    }

    // Update verification request
    await LandownerVerificationRequest.findByIdAndUpdate(requestId, {
      status: 'rejected',
      adminNotes,
      reviewedAt: new Date(),
      reviewedBy: req.user.id
    });

    // Send rejection email
    try {
      const { sendLandownerRejectionEmail } = await import('../services/emailService.js');
      await sendLandownerRejectionEmail(request.userId.email, request.userId.name, adminNotes);
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the rejection if email fails
    }

    res.json({ message: 'Landowner verification rejected' });
  } catch (error) {
    console.error('Error rejecting verification:', error);
    res.status(500).json({ error: 'Failed to reject verification' });
  }
});

// TEMP: promote a user to admin (remove after testing)
router.post('/make-admin', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User promoted to admin', user });
});

export default router;