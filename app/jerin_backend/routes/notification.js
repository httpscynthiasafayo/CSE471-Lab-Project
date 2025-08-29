import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const notes = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});

router.put('/:id/read', requireAuth, async (req, res) => {
  const note = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true },
    { new: true }
  );
  res.json(note);
});

export default router;
