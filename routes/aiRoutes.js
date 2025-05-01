import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are an AI assistant for an event management platform called "Gatherly".
Suggest the best events and venues based on user queries.
Keep responses short, relevant, and limited to the platform's context.

User: ${message}
    `;

    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC84yge9yPoq7cnmV2Nad24jrn1_jF5y6k',
      {
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user'
          }
        ]
      }
    );

    const aiReply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find any suggestions.";

    res.json({ response: aiReply });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'AI error' });
  }
});

export default router;
