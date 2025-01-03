const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Folder = require('../models/Folder');
const Form = require('../models/Form');

// Create folder
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const folder = new Folder({
      name,
      description,
      color,
      creator: req.user.id
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all folders for a user
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ creator: req.user.id })
      .populate('forms', 'title description');
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add form to folder
router.post('/:folderId/forms/:formId', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      creator: req.user.id
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const form = await Form.findOne({
      _id: req.params.formId,
      creator: req.user.id
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (!folder.forms.includes(form._id)) {
      folder.forms.push(form._id);
      await folder.save();
    }

    res.json(folder);
  } catch (error) {
    console.error('Error adding form to folder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove form from folder
router.delete('/:folderId/forms/:formId', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      creator: req.user.id
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    folder.forms = folder.forms.filter(
      formId => formId.toString() !== req.params.formId
    );
    await folder.save();

    res.json(folder);
  } catch (error) {
    console.error('Error removing form from folder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete folder
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 