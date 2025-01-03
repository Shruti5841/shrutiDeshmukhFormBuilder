const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Form = require('../models/Form');
const Response = require('../models/Response');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and videos only
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Add the public route BEFORE the :id route
router.get('/public', async (req, res) => {
  try {
    const forms = await Form.find({})
      .select('title description background fields creator')
      .populate('creator', 'name');
    res.json(forms);
  } catch (error) {
    console.error('Error fetching public forms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create form
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, fields, background, folderId } = req.body;
    
    const form = new Form({
      title,
      description,
      fields,
      background,
      folderId,
      creator: req.user.id
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all forms for a user
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ creator: req.user.id });
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single form
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Only increment views if it's not the creator viewing the form
    const isCreator = req.user && req.user.id === form.creator.toString();
    if (!isCreator) {
      form.views = (form.views || 0) + 1;
      await form.save();
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update form
router.put('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      req.body,
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete form
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route to get form responses
router.get('/:id/responses', auth, async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const responses = await Response.find({ form: req.params.id })
      .sort({ createdAt: -1 });

    res.json({
      form,
      responses,
      stats: {
        views: form.views || 0,
        responses: responses.length,
        completed: responses.filter(r => r.completed).length
      }
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update the submit route to handle file uploads
router.post('/:id/submit', upload.array('files'), async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    let answers = JSON.parse(req.body.answers);
    
    // Handle file uploads if any
    if (req.files?.length) {
      let fileIndex = 0;
      answers = answers.map((answer, index) => {
        if (form.fields[index].type === 'image' || form.fields[index].type === 'video') {
          if (fileIndex < req.files.length) {
            // Return the file path that can be accessed through your server
            return `/uploads/${req.files[fileIndex++].filename}`;
          }
        }
        return answer;
      });
    }

    const response = new Response({
      form: form._id,
      answers,
      completed: true
    });

    await response.save();
    
    // Update form stats
    form.views = (form.views || 0) + 1;
    await form.save();

    res.status(201).json(response);
  } catch (error) {
    console.error('Error submitting form response:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 