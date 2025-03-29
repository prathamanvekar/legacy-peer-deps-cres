const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },        // Original filename
  url: { type: String, required: true },             // Firebase URL
  uploadedAt: { type: Date, default: Date.now }      // Upload timestamp
});

module.exports = mongoose.model('File', fileSchema);
