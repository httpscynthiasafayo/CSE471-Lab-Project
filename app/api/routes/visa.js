import express from 'express';
import Visa from '../models/Visa.js';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = express.Router();

// GET /api/visas - Fetch visa information with filtering
router.get('/', async (req, res) => {
  try {
    const { country, visaType } = req.query;
    const filter = {};
    
    if (country) filter.country = country;
    if (visaType) filter.visaType = visaType;

    const visas = await Visa.find(filter).sort({ country: 1, visaType: 1 });
    res.json(visas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/visas/:id - Fetch specific visa information by ID
router.get('/:id', async (req, res) => {
  try {
    const visa = await Visa.findById(req.params.id);
    if (!visa) {
      return res.status(404).json({ error: 'Visa information not found' });
    }
    res.json(visa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/visas - Create new visa information (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const visa = await Visa.create(req.body);
    res.status(201).json(visa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/visas/:id - Update existing visa information (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const visa = await Visa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!visa) {
      return res.status(404).json({ error: 'Visa information not found' });
    }
    res.json(visa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/visas/:id - Delete visa information (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const visa = await Visa.findByIdAndDelete(req.params.id);
    if (!visa) {
      return res.status(404).json({ error: 'Visa information not found' });
    }
    res.json({ success: true, message: 'Visa information deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;