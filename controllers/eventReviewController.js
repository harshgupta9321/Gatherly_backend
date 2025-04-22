// // controllers/eventReviewController.js
// import EventReview from '../models/EventReview'


// export const addReview = async (req, res) => {
//   try {
//     const { eventId, rating, comment } = req.body;
//     const userId = req.user.userId;

//     const review = new EventReview({ event: eventId, user: userId, rating, comment });
//     await review.save();

//     res.status(201).json({ message: 'Review added successfully', review });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
