const mongoose = require('mongoose');

const PdfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'PDF name is required'],
    unique: true,
    trim: true
  },
  data: {
    type: Buffer,
    required: [true, 'PDF data is required']
  },
  contentType: {
    type: String,
    default: 'application/pdf'
  },
  size: {
    type: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
PdfSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Pdf', PdfSchema);
