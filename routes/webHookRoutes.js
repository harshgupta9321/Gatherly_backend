// routes/webhookRoutes.js
import express from 'express';
import stripe from '../utils/stripe.js';
import Booking from '../models/Booking.js';

const router = express.Router();

router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, venueId, date } = session.metadata;

    try {
      const booking = new Booking({
        user: userId,
        venue: venueId,
        date,
        status: 'confirmed', // or 'paid'
      });
      await booking.save();
      console.log('Booking saved after successful payment:', booking._id);
    } catch (err) {
      console.error('Error creating booking from webhook:', err.message);
    }
  }

  res.status(200).json({ received: true });
});

export default router;
