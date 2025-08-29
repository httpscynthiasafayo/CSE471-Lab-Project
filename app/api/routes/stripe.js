import 'dotenv/config'; 
import express from "express";
import Stripe from "stripe";

////
import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Make sure the key is loaded correctly
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// Cancel Stripe subscription and update DB
router.post('/cancel-subscription', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found.' });
    }

    const subscriptionId = user?.subscription?.subscriptionId;
    //console.log('Cancel request for subscriptionId:', subscriptionId);
    if (!subscriptionId) {
      console.log('No subscriptionId found in user document');
      return res.status(400).json({ error: 'No active Stripe subscription found.' });
    }

    // Try to cancel subscription in Stripe
    let stripeResponse;
    try {
      stripeResponse = await stripe.subscriptions.cancel(subscriptionId);
      console.log('Stripe cancellation response:', stripeResponse);
    } catch (stripeErr) {
      console.error('Stripe API error:', stripeErr.message);
      return res.status(500).json({ error: 'Stripe API error: ' + stripeErr.message });
    }

    // Update user subscription in DB
    user.subscription = {
      plan: 'none',
      status: 'inactive',
      startDate: null,
      subscriptionId: null
    };
    user.planSet = false;
    await user.save();

    res.json({ message: 'Subscription cancelled successfully.' });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription.' });
  }
});
router.get('/get-session-details', async (req, res) => {
  const { sessionId } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({ subscriptionId: session.subscription });
  } catch (err) {
    res.status(500).json({ error: "Failed to get session details." });
  }
});

export default router;
