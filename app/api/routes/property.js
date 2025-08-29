import express from 'express';
import Property from '../models/Property.js';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';

import Bookmark from '../models/Bookmark.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

import User from '../models/User.js'; 


const router = express.Router();

router.get('/', async (req, res) => {
  const { location, type, maxPrice } = req.query;
  const filter = {};
  if (location) filter.location = new RegExp(location, 'i');
  if (type) filter.type = type;
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };

  const props = await Property.find(filter).sort({ createdAt: -1 });
  res.json(props);
});

router.get('/:id', async (req, res) => {
  const prop = await Property.findById(req.params.id);
  res.json(prop);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const prop = await Property.create(req.body);
    console.log(`🏠 New property created: ${prop.title} (${prop.location})`);

    const bookmarks = await Bookmark.find({ itemType: 'PROPERTY' }).populate('user');
    console.log(`🔖 Found ${bookmarks.length} property bookmarks`);

    for (const bookmark of bookmarks) {
      const bookmarkedProp = await Property.findById(bookmark.itemId);
      if (!bookmarkedProp) {
        console.log(`⚠️ Bookmark ${bookmark._id} has no valid property`);
        continue;
      }

     
      const newLoc = prop.location.toLowerCase();
      const oldLoc = bookmarkedProp.location.toLowerCase();

    
      if (newLoc.includes(oldLoc) || oldLoc.includes(newLoc)) {
        console.log(`Match found for user ${bookmark.user.email}: ${oldLoc} ↔ ${newLoc}`);

       
        await Notification.create({
          user: bookmark.user._id,
          message: `New property available in your preferred location: ${prop.title}`
        });

        
        await sendEmail({
          to: bookmark.user.email,
          subject: '🏠 New Rent Alert',
          text: `Hi ${bookmark.user.name},\n\nA new property in your preferred location (${prop.location}) is now available: ${prop.title}\n\nView: ${process.env.FRONTEND_URL}/property/${prop._id}`
        });
      } else {
        console.log(`No match for user ${bookmark.user.email}: ${oldLoc} vs ${newLoc}`);
      }
    }

    res.json(prop);
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ error: "Failed to create property" });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const prop = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prop);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
