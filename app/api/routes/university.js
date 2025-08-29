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

export default router;
