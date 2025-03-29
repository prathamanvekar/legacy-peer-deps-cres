const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true }, // ✅ Assignment Title
    description: { type: String },
    deadline: { type: Date, required: true },
    course: { type: String, required: true }, // ✅ Stores "COURSE-6588" instead of ObjectId
    courseTitle: { type: String, required: true }, // ✅ Store Course Title Separately
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true }, // Trainer who created it
    submissions: [
        {
            student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // Student who submitted
            fileUrl: { type: String, required: true },
            submittedAt: { type: Date, default: Date.now }
        }
    ]
});

// ✅ Prevent Overwriting Model
const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
