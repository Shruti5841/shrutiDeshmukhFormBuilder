const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  fields: [{
    type: {
      type: String,
      required: true,
      enum: ['text', 'image', 'video', 'gif', 'number', 'email', 'phone', 'date', 'rating', 'buttons', 'radio', 'checkbox', 'select']
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    options: [String],
    order: {
      type: Number,
      default: 0
    }
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Form = mongoose.model('Form', formSchema);
module.exports = Form; 


