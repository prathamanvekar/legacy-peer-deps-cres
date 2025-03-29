const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    assignmentId: { type: String, unique: true, required: true }, // 🔹 New
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    course: { type: String, required: true }, // e.g., "COURSE-6588"
    courseTitle: { type: String, required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    submissions: [
        {
            studentEmail: { type: String, required: true }, // Already updated version
            fileUrl: { type: String, required: true },
            submittedAt: { type: Date, default: Date.now }
        }
    ]
});


// ✅ Prevent Overwriting Model
const assignment = mongoose.models.Assignment || mongoose.model("assignment", assignmentSchema);
module.exports = assignment;
