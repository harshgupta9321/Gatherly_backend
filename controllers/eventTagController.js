// controllers/eventTagController.js
import EventTag from '../models/EventTag.js';

export const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    const tag = new EventTag({ name, description });
    await tag.save();

    res.status(201).json({ message: 'Event tag created', tag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name, description } = req.body;

    const tag = await EventTag.findByIdAndUpdate(tagId, { name, description }, { new: true });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json({ message: 'Event tag updated', tag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;

    const tag = await EventTag.findByIdAndDelete(tagId);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json({ message: 'Event tag deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
