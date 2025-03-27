const mongoose = require('mongoose');

const studentResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentResource', studentResourceSchema);
