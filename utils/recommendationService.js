// utils/recommendationService.js
import TicketBooking from '../models/TicketBooking.js';
import Event from '../models/Event.js';

export const getRecommendedEvents = async (userId) => {
  // Get the categories of events the user booked
  const bookings = await TicketBooking.find({ user: userId }).populate('event');
  const categories = bookings.map(b => b.event.category);

  // Count frequency of categories
  const freq = {};
  categories.forEach(cat => {
    freq[cat] = (freq[cat] || 0) + 1;
  });

  // Sort by frequency
  const sortedCategories = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

  // Get events from top 2 favorite categories (excluding already booked)
  const bookedEventIds = bookings.map(b => b.event._id.toString());

  const recommendedEvents = await Event.find({
    category: { $in: sortedCategories.slice(0, 2) },
    _id: { $nin: bookedEventIds },
  }).limit(10);

  // Also suggest top trending events (based on ticket count)
  const trendingEvents = await TicketBooking.aggregate([
    { $group: { _id: '$event', count: { $sum: '$quantity' } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: '_id',
        as: 'event',
      },
    },
    { $unwind: '$event' },
    { $replaceRoot: { newRoot: '$event' } },
  ]);

  return {
    personalized: recommendedEvents,
    trending: trendingEvents,
  };
};
