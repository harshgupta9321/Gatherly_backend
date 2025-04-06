import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';

export const addBooking = async (req, res) => {
    try {
        const { venueId, date } = req.body;

        const existingBooking = await Booking.findOne({ venue: venueId, date });
        if (existingBooking) {
            return res.status(400).json({ message: 'Venue already booked on this date' });
        }

        const booking = new Booking({
            user: req.user.userId,
            venue: venueId,
            date,
        });

        await booking.save();
        res.status(201).json({ message: 'Booking added successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.userId }).populate('venue', 'name location');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
