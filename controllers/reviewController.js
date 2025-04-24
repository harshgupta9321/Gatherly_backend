// controllers/reviewController.js
import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  try {
    const { rating, comment, eventId, venueId } = req.body;

    if (!eventId && !venueId) {
      return res.status(400).json({ message: 'Event or Venue ID required' });
    }

    const review = new Review({
      user: req.user.userId,
      rating,
      comment,
      event: eventId || undefined,
      venue: venueId || undefined
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { eventId, venueId } = req.query;

    let filter = {};
    if (eventId) filter.event = eventId;
    if (venueId) filter.venue = venueId;

    const reviews = await Review.find(filter).populate('user', 'name');
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
