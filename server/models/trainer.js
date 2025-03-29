const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true }, // Ensure email is required
  password: { type: String, required: true },
  expertise: { type: [String], required: true }, // Ensure expertise is required
  contactNumber: { type: String, required: true }, // ✅ Added contactNumber field
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trainer', trainerSchema);
