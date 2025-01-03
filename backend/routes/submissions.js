const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Form = require('../models/Form');
const Submission = require('../models/Submission');

// Submit form response
router.post('/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    const { name, email, responses } = req.body;

    // Verify that the form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Create new submission
    const submission = new Submission({
      formId,
      name,
      email,
      responses
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all submissions for a form (requires auth)
router.get('/form/:formId', auth, async (req, res) => {
  try {
    const { formId } = req.params;

    // Verify that the form exists and belongs to the user
    const form = await Form.findOne({
      _id: formId,
      creator: req.user.id
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Get submissions
    const submissions = await Submission.find({ formId })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single submission (requires auth)
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify that the form belongs to the user
    const form = await Form.findOne({
      _id: submission.formId,
      creator: req.user.id
    });

    if (!form) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a submission (requires auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify that the form belongs to the user
    const form = await Form.findOne({
      _id: submission.formId,
      creator: req.user.id
    });

    if (!form) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await submission.remove();
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 