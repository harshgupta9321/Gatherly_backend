// controllers/dashboardController.js
import Event from '../models/Event.js';
import TicketBooking from '../models/TicketBooking.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const attendees = await User.countDocuments({ role: 'audience' });
    const organizers = await User.countDocuments({ role: 'Organizer' });

    const ticketsRevenue = await TicketBooking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const venueRevenue = await VenueBooking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue =
      (ticketsRevenue[0]?.total || 0) + (venueRevenue[0]?.total || 0);

    const topEvents = await TicketBooking.aggregate([
      {
        $group: {
          _id: '$event',
          totalRevenue: { $sum: '$totalPrice' },
          ticketsSold: { $sum: '$quantity' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      users: {
        total: totalUsers,
        attendees,
        organizers,
      },
      revenue: {
        tickets: ticketsRevenue[0]?.total || 0,
        venue: venueRevenue[0]?.total || 0,
        total: totalRevenue,
      },
      topEvents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAdminDashboardData = async (req, res) => {
  try {
    // Fetch total number of events
    const totalEvents = await Event.countDocuments();

    // Fetch total ticket sales and revenue
    const totalTicketSales = await TicketBooking.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const revenue = totalTicketSales[0] ? totalTicketSales[0].totalRevenue : 0;

    // Fetch total venue bookings (for admin to view all bookings)
    const totalVenueBookings = await Booking.countDocuments();

    res.json({
      totalEvents,
      revenue,
      totalVenueBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getOrganizerDashboardData = async (req, res) => {
    try {
      // Fetch events by the organizer
      const events = await Event.find({ createdBy: req.user.userId });
  
      // Fetch ticket sales for each event
      const eventData = await Promise.all(
        events.map(async (event) => {
          const totalSales = await TicketBooking.aggregate([
            { $match: { event: event._id } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
          ]);
  
          return {
            eventName: event.name,
            totalTicketsSold: event.ticketPrice * (event.ticketsAvailable - event.ticketsAvailable),
            revenue: totalSales[0] ? totalSales[0].totalRevenue : 0,
          };
        })
      );
  
      res.json({ events: eventData });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const getUserDashboardData = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Get ticket bookings
      const tickets = await TicketBooking.find({ user: userId }).populate('event');
  
      // Get venue bookings
      const venues = await Booking.find({ user: userId });
  
      res.json({
        tickets,
        venues,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  