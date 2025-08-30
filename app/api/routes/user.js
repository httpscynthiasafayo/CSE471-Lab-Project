import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import requireRole from '../middleware/requireRole.js';
import path from "path";
import fs from "fs";
import multer from "multer";

const router = express.Router();
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "cv");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${req.user.id}.pdf`), // keep 1 file per user
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) =>
    file.mimetype === "application/pdf" ? cb(null, true) : cb(new Error("Only PDF files are allowed")),
});
// POST /api/me/cv   (form-data: cv=<PDF>)
router.post("/cv", requireAuth, upload.single("cv"), async (req, res, next) => {
  try {
    const cvUrl = `/uploads/cv/${req.user.id}.pdf`;
    const user = await User.findByIdAndUpdate(req.user.id, { cvUrl }, { new: true }).select("-passwordHash");
    res.json({ ok: true, cvUrl: user.cvUrl });
  } catch (err) {
    next(err);
  }
});
/** ====== Me (read) ====== **/
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    next(err);
  }
});
/** ====== Me (update + optional password change) ====== **/
router.put("/", requireAuth, async (req, res, next) => {
  try {
    const { name, cvUrl, currentPassword, newPassword } = req.body || {};

    // Basic updates
    const updates = {};
    if (typeof name !== "undefined") updates.name = name;
    if (typeof cvUrl !== "undefined") updates.cvUrl = cvUrl;

    // If changing password, verify old one first
    if (newPassword) {
      const me = await User.findById(req.user.id).select("+passwordHash");
      const ok = await bcrypt.compare(currentPassword || "", me.passwordHash);
      if (!ok) return res.status(400).json({ error: "Current password is incorrect" });

      me.passwordHash = await bcrypt.hash(newPassword, 10);
      Object.assign(me, updates);
      await me.save();
      const safe = me.toObject();
            delete safe.passwordHash;
            return res.json(safe);
          }
      
          const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
          res.json(user);
        } catch (err) {
          next(err);
        }
      });


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


//subscription of stripe change
// Free Plan subscription
router.post('/subscribe-free', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.subscription = {
      plan: 'free',
      status: 'active',
      startDate: new Date(),
    };

    user.planSet = true;

    await user.save();
    res.json({ message: 'Free plan activated!', subscription: user.subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Premium Plan subscription (call after Stripe Checkout success)
router.post('/subscribe-premium', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.body; // get from frontend after Stripe checkout
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.subscription = {
      plan: 'premium',
      status: 'active',
      startDate: new Date(),
      subscriptionId: subscriptionId || null
    };
    user.planSet = true;
    await user.save();
    res.json({ message: 'Premium plan activated!', subscription: user.subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
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
