// controllers/ticketBookingController.js
import TicketBooking from '../models/TicketBooking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendTemplatedEmail } from '../utils/emailUtil.js';
import stripe from '../utils/stripe.js';

export const initiateTicketBooking = async (req, res) => {
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
          unit_amount: Math.round(event.ticketPrice * 100),
        },
        quantity: tickets,
      }],
      success_url: `http://localhost:5173/ticket-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/ticket-cancel`,
      metadata: {
        eventId,
        userId,
        tickets,
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const confirmTicketBooking = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // 1. Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const { eventId, userId, tickets } = session.metadata;
    tickets = parseInt(session.metadata.tickets);
    

    // 2. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketsAvailable < tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // 3. Create Ticket Booking
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

    // 4. Send Confirmation Email
    const user = await User.findById(userId);

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
    console.error('Error in confirmTicketBooking:', error.message);
    res.status(500).json({ message: error.message });
  }
};


export const getMyBookedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await TicketBooking.find({ user: userId }).populate('event');
<<<<<<< HEAD
    // const events = bookings.map(booking => booking.event);

    res.status(200).json({ bookings });
=======

    res.status(200).json({bookings });
>>>>>>> b44982d00378ff404c0b0fa951d2dd36ea8a694c
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



