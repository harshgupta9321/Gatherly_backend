// controllers/ticketBookingController.js
import TicketBooking from '../models/TicketBooking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendTemplatedEmail } from '../utils/emailUtil.js';
import stripe from '../utils/stripe.js';
import { AwesomeQR } from "awesome-qr";

export const initiateTicketBooking = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketsAvailable < tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Check if user already booked this event
    const existingBooking = await TicketBooking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this event." });
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

    let { eventId, userId, tickets } = session.metadata;
    tickets = parseInt(session.metadata.tickets);
    
    // 2. Check if event exists
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!user) return res.status(404).json({ message: "User not found" });


    if (event.ticketsAvailable < tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // 3. Check if user already booked this event
    const existingBooking = await TicketBooking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this event." });
    }
  
    
    // 4. Create Ticket Booking
    const totalPrice = event.ticketPrice * tickets;

    const qrData = {
      user: { id: user._id, name: user.name, email: user.email },
      event: { id: event._id, title: event.title, createdBy: event.createdBy },
      tickets,
      date: new Date().toISOString()
    };
    
    const qrBuffer = await new AwesomeQR({
      text: JSON.stringify(qrData),
      size: 500,
      margin: 20,
      dotScale: 0.8,
      colorDark: "#000000",
      colorLight: "#ffffff",
      logoImage: event.image, // make sure this is a valid URL if using logo
      logoScale: 0.3,
    }).draw();
    
    const qrBase64 = `data:image/png;base64,${qrBuffer.toString("base64")}`;
    
    // ✅ Save booking with QR
    const ticketBooking = new TicketBooking({
      event: eventId,
      user: userId,
      tickets,
      totalPrice,
      qrCode: qrBase64,
    });
    
    await ticketBooking.save();
    

    await sendTemplatedEmail(
      user.email,
      "Your Ticket Booking Confirmation",
      "ticketConfirmation", 
      {
        name: user.name,
        quantity: tickets,
        eventTitle: event.title,
        eventDate: event.date.toDateString(),
        qrCode: qrBase64, 
      }
    );
    
    res.status(201).json({ message: "Ticket booking successful", ticketBooking });
    
  } catch (error) {
    console.error('Error in confirmTicketBooking:', error.message);
    res.status(500).json({ message: error.message });
  }
};


export const getMyBookedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await TicketBooking.find({ user: userId }).populate('event')

    res.status(200).json({bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ticket-booking/qr/:bookingId
export const renderQRCode = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await TicketBooking.findById(bookingId).populate('event user');
    if (!booking) return res.status(404).send('Booking not found');

    const qrCodeBase64 = booking.qrCode;
    if (!qrCodeBase64) return res.status(404).send('QR code not found');

    // Render QR in HTML
    res.send(`
      <html>
        <head><title>QR Code for ${booking.event.title}</title></head>
        <body style="text-align:center;">
          <h2>QR Code for ${booking.event.title}</h2>
          <p>Booked by ${booking.user.name}</p>
          <img src="${qrCodeBase64}" alt="QR Code" />
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error rendering QR code:', error.message);
    res.status(500).send('Server error');
  }
};



