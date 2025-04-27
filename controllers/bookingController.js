import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import stripe from '../utils/stripe.js';  // Stripe configuration file

// Create booking and handle payment
// export const createBooking = async (req, res) => {
//   try {
//     const { venueId, date } = req.body;

//     // Find the venue
//     const venue = await Venue.findById(venueId);
//     if (!venue) return res.status(404).json({ message: 'Venue not found' });

//     // Calculate total price for the booking (can be adjusted based on your logic)
//     const totalAmount = venue.price * 100; // Stripe expects amount in cents

//     // Create a Stripe Checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: [
//         {
//           price_data: {
//             currency: 'inr',
//             product_data: {
//               name: venue.name,
//               description: venue.description,
//             },
//             unit_amount: totalAmount, // Price of venue booking
//           },
//           quantity: 1, // Only one venue booking per session
//         },
//       ],
//     //   success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//     //   cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//     success_url: 'https://example.com/success',
//   cancel_url: 'https://example.com/cancel',
//       metadata: {
//         venueId,
//         userId: req.user.userId,
//         date,
//       },
//     });

//     // Return the Stripe Checkout URL to the frontend
//     res.status(200).json({ url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const createBooking = async (req, res) => {
//   try {
//     const { venueId, date } = req.body;

//     const venue = await Venue.findById(venueId);
//     if (!venue) return res.status(404).json({ message: 'Venue not found' });

//     const totalAmount = venue.price * 100;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: [
//         {
//           price_data: {
//             currency: 'inr',
//             product_data: {
//               name: venue.name,
//               description: venue.description,
//             },
//             unit_amount: totalAmount,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: 'http://localhost:5173/payment-success',
//       cancel_url: 'http://localhost:5173/payment-cancel',
//       metadata: {
//         venueId,
//         userId: req.user.userId,
//         date,
//       },
//     });

//     res.status(200).json({ url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };


export const initiateVenueBooking = async (req, res) => {
  try {
    const { venueId, date } = req.body;
    const userId = req.user.userId;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const totalAmount = venue.price * 100;

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
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const confirmVenueBooking = async (req, res) => {
  try {
    const { venueId, date } = req.body;
    const userId = req.user.userId;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const booking = new Booking({
      venue: venueId,
      user: userId,
      date,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// export const createBooking = async (req, res) => {
//     try {
//         const { venueId, date } = req.body;

//         const venue = await Venue.findById(venueId);
//         if (!venue) return res.status(404).json({ message: 'Venue not found' });

//         const booking = new Booking({
//             venue: venueId,
//             user: req.user.userId,
//             date,
//         });

//         await booking.save();
//         res.status(201).json({ message: 'Booking created', booking });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

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
