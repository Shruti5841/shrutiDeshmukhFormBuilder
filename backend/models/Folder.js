const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  forms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  }],
  color: {
    type: String,
    default: '#1a73e8'
  }
}, {
  timestamps: true
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder; 