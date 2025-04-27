// controllers/ticketBookingController.js
import TicketBooking from '../models/TicketBooking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendTemplatedEmail } from '../utils/emailUtil.js';

import stripe from '../utils/stripe.js';

export const initiateStripeCheckout = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketsAvailable < tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: event.title,
            description: event.description,
          },
          unit_amount: Math.round(event.ticketPrice * 100), // cents
        },
        quantity: tickets,
      }],
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
      // success_url: 'https://example.com/success',
      // cancel_url: 'https://example.com/cancel',
      metadata: {
        eventId,
        userId,
        tickets
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createTicketBooking = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketsAvailable < tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = event.ticketPrice * tickets;

    const ticketBooking = new TicketBooking({
      event: eventId,
      user: userId,
      tickets,
      totalPrice,
    });

    await ticketBooking.save();

    event.ticketsAvailable -= tickets;
    await event.save();

    // Fetch user for email
    const user = await User.findById(userId);

    // Send confirmation email
    await sendTemplatedEmail(
      user.email,
      'Your Ticket Booking Confirmation',
      'ticketConfirmation',
      {
        name: user.name,
        quantity: tickets,
        eventTitle: event.title,
        eventDate: event.date.toDateString(),
      }
    );

    res.status(201).json({ message: 'Ticket booking successful', ticketBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await TicketBooking.find({ user: userId }).populate('event');
    const events = bookings.map(booking => booking.event);

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

