import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err) { next(err); }
});
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const { name, resumeUrl, cvUrl, password } = req.body || {};
    const updates = { name, resumeUrl, cvUrl };
    if (password) updates.passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json(user);
  } catch (err) { next(err); }
});

router.put('/contact', requireAuth, async (req, res, next) => {
  try {
    const { phone, whatsappUrl, socialUrl } = req.body || {};
    const updates = { phone, whatsappUrl, socialUrl };
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json(user);
  } catch (err) { next(err); }
});

export default router;
