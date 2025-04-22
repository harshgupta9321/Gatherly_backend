// controllers/eventSponsorController.js
import EventSponsor from '../models/EventSponsor.js';
import Event from '../models/Event.js';

export const addSponsor = async (req, res) => {
  try {
    const { eventId, sponsorName, sponsorLogo, website } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const sponsor = new EventSponsor({ event: eventId, sponsorName, sponsorLogo, website });
    await sponsor.save();

    res.status(201).json({ message: 'Sponsor added to event', sponsor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
