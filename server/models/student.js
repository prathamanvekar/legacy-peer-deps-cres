const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // 🔐 Added password

  enrolledCourses: [{ type: String, required: true }], // e.g., "COURSE-6588"

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
