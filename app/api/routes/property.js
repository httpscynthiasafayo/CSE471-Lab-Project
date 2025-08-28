// routes/property.js
import express from 'express';
import Property from '../models/Property.js';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to check if user is the property owner or an admin
const requirePropertyOwnerOrAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    // Check if the user is an admin or the property owner
    if (req.user.role === 'admin' || property.landownerId.toString() === req.user.id) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all properties (no changes here)
router.get('/', async (req, res) => {
  const { location, type, maxPrice } = req.query;
  const filter = {};
  if (location) filter.location = new RegExp(location, 'i');
  if (type) filter.type = type;
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };

  try {
    const props = await Property.find(filter).sort({ createdAt: -1 });
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET a specific property by ID
router.get('/:id', async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(prop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// NEW: GET properties for a specific landowner
router.get('/landowner/my-properties', requireAuth, async (req, res) => {
  try {
    const props = await Property.find({ landownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch landowner properties' });
  }
});

// POST a new property (allowed for verified landowners and admins)
router.post('/', requireAuth, async (req, res) => {
  try {
    // Check if the user is an admin or a verified landowner
    const user = await User.findById(req.user.id);
    if (user.role === 'admin' || (user.role === 'landowner' && user.isLandownerVerified)) {
      const prop = await Property.create({
        ...req.body,
        landownerId: req.user.id // Automatically set the landowner ID
      });
      res.status(201).json(prop);
    } else {
      return res.status(403).json({ error: 'Forbidden: Only verified landowners and admins can create properties' });
    }
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// PUT to update a property (allowed for property owner or admin)
router.put('/:id', requireAuth, requirePropertyOwnerOrAdmin, async (req, res) => {
  try {
    const prop = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE a property (allowed for property owner or admin)
router.delete('/:id', requireAuth, requirePropertyOwnerOrAdmin, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;
