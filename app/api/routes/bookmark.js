import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { itemType, itemId } = req.body;
  const exists = await Bookmark.findOne({ user: req.user.id, itemType, itemId });
  if (exists) return res.status(400).json({ error: 'Already bookmarked' });

  const saved = await Bookmark.create({ user: req.user.id, itemType, itemId });
  res.json(saved);
});

router.get('/', requireAuth, async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user.id });
  res.json(bookmarks);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ success: true });
});

export default router;
