// controllers/recommendationController.js
import { getRecommendedEvents } from '../utils/recommendationService.js';

export const recommendEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await getRecommendedEvents(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
