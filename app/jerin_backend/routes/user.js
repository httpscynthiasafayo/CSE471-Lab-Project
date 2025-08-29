import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
});

router.put('/', requireAuth, async (req, res) => {
  const { name, resumeUrl, cvUrl, password } = req.body;
    const updates = { name, resumeUrl, cvUrl };

  if (password) {
    updates.passwordHash = await bcrypt.hash(password, 10);
  }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json(user);
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


export default router;
