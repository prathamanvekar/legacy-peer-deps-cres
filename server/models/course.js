const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: { type: String, unique: true, required: true }, // ✅ Unique Course ID
  title: { type: String, required: true }, // ✅ Course Title
  description: String,
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  assignments: [
    {
      assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }, // ✅ Store Assignment ID
      title: { type: String, required: true } // ✅ Store Assignment Title
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

// Ensure Unique Course ID
courseSchema.pre("save", async function (next) {
  if (!this.courseId) {
    let unique = false;
    let newCourseId;
    
    while (!unique) {
      newCourseId = `COURSE-${Math.floor(1000 + Math.random() * 9000)}`; // Generate ID
      const existingCourse = await mongoose.model("Course").findOne({ courseId: newCourseId });
      if (!existingCourse) unique = true; // If no duplicate, proceed
    }

    this.courseId = newCourseId;
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
