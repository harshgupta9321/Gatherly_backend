import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';

export const createBooking = async (req, res) => {
    try {
        const { venueId, date } = req.body;

        const venue = await Venue.findById(venueId);
        if (!venue) return res.status(404).json({ message: 'Venue not found' });

        const booking = new Booking({
            venue: venueId,
            user: req.user.userId,
            date,
        });

        await booking.save();
        res.status(201).json({ message: 'Booking created', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

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
