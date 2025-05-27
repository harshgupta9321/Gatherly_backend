import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/authMiddleware.js';
import Event from '../models/Event.js';
import TicketBooking from '../models/TicketBooking.js'; // if you have this model

const router = express.Router();

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id || null;

    let contextData = '';
    let systemInstruction = `
You are an AI assistant for an event management platform called "Gatherly".
Use only the provided context data to answer user questions.
Be concise and helpful.
`;

    // === Intent Detection (simple keyword matching, can be improved later)
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('event') || lowerMessage.includes('venue')) {
      const events = await Event.find().limit(5);
       // or filter by date, location, etc.
       console.log(events);

      if (events.length > 0) {
        contextData = events.map(e => `Title: ${e.title}\nDate: ${e.date}\nLocation: ${e.location}\nDescription: ${e.description}\n`).join('\n');
      } else {
        contextData = 'No events found.';
      }
    }

    if (userId && (lowerMessage.includes('my ticket') || lowerMessage.includes('my booking'))) {
      const bookings = await TicketBooking.find({ user: userId }).populate('event');

      if (bookings.length > 0) {
        contextData = bookings.map(b => {
          return `You booked ${b.tickets} ticket(s) for "${b.event.title}" on ${b.event.date} at ${b.event.location}.`;
        }).join('\n');
      } else {
        contextData = 'No bookings found for your account.';
      }
    }

    // === Final Prompt
    const finalPrompt = `
${systemInstruction}

Context Data:
${contextData || 'No relevant data found.'}

User Question: ${message}
`;

    // === Gemini API call
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: finalPrompt }]
          }
        ]
      }
    );

    const aiReply =
      geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't find any relevant answer.";

    res.json({ response: aiReply });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI error occurred. Please try again later.' });
  }
});

export default router;
