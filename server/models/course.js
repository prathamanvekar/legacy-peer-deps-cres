const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  resources: [{ type: String }], // ✅ Add this line
  createdAt: { type: Date, default: Date.now },
});

// Ensure Unique Course ID
courseSchema.pre("save", async function (next) {
  if (!this.courseId) {
    let unique = false;
    let newCourseId;

    while (!unique) {
      newCourseId = `COURSE-${Math.floor(1000 + Math.random() * 9000)}`;
      const existingCourse = await mongoose.model("Course").findOne({ courseId: newCourseId });
      if (!existingCourse) unique = true;
    }

    this.courseId = newCourseId;
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
