import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import stripe from '../utils/stripe.js';  // Your stripe secret setup

// STEP 1: Create Stripe Checkout Session
export const initiateVenueBooking = async (req, res) => {
  try {
    const { venueId, date } = req.body;
    const userId = req.user.userId;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const totalAmount = venue.price * 100; // Stripe takes amount in paisa

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: venue.name,
            description: venue.description,
          },
          unit_amount: totalAmount,
        },
        quantity: 1,
      }],
      success_url: `http://localhost:5173/venue-payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
      metadata: {
        venueId,
        userId,
        date,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Session Creation Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// STEP 2: Confirm Booking After Payment
export const confirmVenueBooking = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Fetch session from Stripe using sessionId
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const { venueId, userId, date } = session.metadata;

    if (!venueId || !userId || !date) {
      return res.status(400).json({ message: 'Invalid session metadata' });
    }

    // Check if venue is already booked on selected date
    const existingBooking = await Booking.findOne({ venue: venueId, date });
    if (existingBooking) {
      return res.status(400).json({ message: 'Venue already booked on selected date' });
    }

    // Create new booking
    const newBooking = new Booking({
      venue: venueId,
      user: userId,
      date,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    console.error('Booking Confirmation Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET User's All Bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('venue', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET All Bookings (Admin Only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('venue', 'name location');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH Update Booking Status (Admin Only)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = req.body.status;
    await booking.save();

    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
