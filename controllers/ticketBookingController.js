// controllers/ticketBookingController.js
import TicketBooking from '../models/TicketBooking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendTemplatedEmail } from '../utils/emailUtil.js';

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
