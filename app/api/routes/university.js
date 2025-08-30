import express from 'express';
import University from '../models/University.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { country, program, maxCost } = req.query;
  const filter = {};
  if (country) filter.country = country;
  if (program) filter.programTypes = program;
  if (maxCost) filter.costEstimate = { $lte: Number(maxCost) };

  const universities = await University.find(filter).limit(50);
  res.json(universities);
});

router.get('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id).populate('programs');
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    res.json(university);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
