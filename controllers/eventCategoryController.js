// controllers/eventCategoryController.js
import EventCategory from '../models/EventCategory.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new EventCategory({ name, description });
    await category.save();

    res.status(201).json({ message: 'Event category created', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await EventCategory.findByIdAndUpdate(categoryId, { name, description }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Event category updated', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await EventCategory.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Event category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
