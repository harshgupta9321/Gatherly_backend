import Booking from '../models/Booking.js';
// import Venue from '../models/V.js'


// Create booking
export const createBooking = async (req, res) => {
  try {
    const { venueId, date, hoursBooked } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ msg: 'Venue not found' });
    if (!venue.isApproved) return res.status(400).json({ msg: 'Venue not approved' });

    const totalPrice = hoursBooked * venue.pricePerHour;

    const booking = await Booking.create({
      user: req.user.id,
      venue: venueId,
      date,
      hoursBooked,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Booking error', error: err.message });
  }
};

// Get all bookings for logged-in user
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('venue');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching bookings', error: err.message });
  }
};
