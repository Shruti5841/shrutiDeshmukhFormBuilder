const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  answers: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    validate: {
      validator: function(arr) {
        return Array.isArray(arr);
      },
      message: 'Answers must be an array'
    }
  },
  completed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add pre-save middleware to ensure answers array matches form fields
responseSchema.pre('save', async function(next) {
  try {
    const form = await mongoose.model('Form').findById(this.form);
    if (!form) {
      throw new Error('Form not found');
    }
    
    if (this.answers.length !== form.fields.length) {
      throw new Error('Number of answers does not match number of form fields');
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response; 