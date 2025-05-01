import Sponsor from '../models/SponsorModel.js';
import SponsorshipRequest from '../models/sponsorshipRequest.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

// Sponsor adds/updates their sponsorship details
export const addOrUpdateSponsorDetails = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user || user.role !== 'sponsor') {
      return res.status(403).json({ message: 'Only sponsors can add or update sponsorship details' });
    }

    const { company, category, criteria, phone } = req.body;

    if (!company || !category || !phone) {
      return res.status(400).json({ message: 'Company, category, and phone are required' });
    }

    // Ensure category is an array
    const categories = Array.isArray(category) ? category : [category];

    let sponsor = await Sponsor.findOne({ user: userId });

    if (sponsor) {
      // Update existing
      sponsor.company = company;
      sponsor.category = categories; // update category to array
      sponsor.criteria = criteria;
      sponsor.phone = phone;
      await sponsor.save();
    } else {
      // Create new
      sponsor = await Sponsor.create({
        user: userId,
        company,
        category: categories, // set category as array
        criteria,
        phone,
      });
    }

    res.status(200).json({ message: 'Sponsorship details saved successfully', sponsor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Organizer requests sponsorship
export const requestSponsorship = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { sponsorId, message } = req.body;  // You can add message if you want

    const sponsor = await Sponsor.findById(sponsorId).populate('user', 'name email phone');
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    // Ideally, you'd save the sponsorship request to a DB, but here we'll just return a success message.
    // You can later extend to build a `SponsorshipRequest` model to track these requests.

    res.status(200).json({
      message: 'Sponsorship request sent successfully. Please follow up with the sponsor.',
      sponsorContact: {
        company: sponsor.company,
        phone: sponsor.phone,
        email: sponsor.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all sponsors (for organizers to view)
export const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().populate('user', 'name email avatar phone');
    res.status(200).json(sponsors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Organizer sends sponsorship request
export const createSponsorshipRequest = async (req, res) => {
    try {
      const { sponsorId, eventId, message, categories } = req.body; // Capture categories from request
      const organizerId = req.user.userId;
  
      // Check sponsor exists & is a sponsor
      const sponsor = await User.findById(sponsorId);
      if (!sponsor || sponsor.role !== 'sponsor') {
        return res.status(400).json({ message: 'Invalid sponsor' });
      }
  
      // Check event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(400).json({ message: 'Event not found' });
      }
  
      // Optional: Check that the organizer is the owner of the event
      if (String(event.organizer) !== String(organizerId)) {
        return res.status(403).json({ message: 'You can only request sponsorships for your own events' });
      }
  
      // Check if categories are provided (this can be required based on your validation rules)
      if (!categories || categories.length === 0) {
        return res.status(400).json({ message: 'At least one category is required for the sponsorship request' });
      }
  
      const sponsorshipRequest = new SponsorshipRequest({
        organizer: organizerId,
        sponsor: sponsorId,
        event: eventId,
        message,
        categories, // Save the categories field
      });
  
      await sponsorshipRequest.save();
  
      res.status(201).json({ message: 'Sponsorship request sent successfully', sponsorshipRequest });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Sponsor views their sponsorship requests
export const getSponsorshipRequests = async (req, res) => {
  try {
    const sponsorId = req.user.userId;

    const requests = await SponsorshipRequest.find({ sponsor: sponsorId })
      .populate('organizer', 'name email phone')
      .populate('event', 'name date');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Sponsor updates a request (approve or reject)
export const updateSponsorshipRequestStatus = async (req, res) => {
  try {
    const sponsorId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await SponsorshipRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Sponsorship request not found' });
    }

    if (String(request.sponsor) !== String(sponsorId)) {
      return res.status(403).json({ message: 'Unauthorized: This is not your sponsorship request' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: 'Sponsorship request updated', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
