const Assignment = require("../models/Assignment");

// ✅ Get all submissions using assignmentId and courseId
exports.getSubmissions = async (req, res) => {
    try {
        const { assignmentId, courseId } = req.params;

        console.log("🔍 Debugging getSubmissions:");
        console.log("Received Course ID:", courseId);
        console.log("Received Assignment ID:", assignmentId);

        if (!assignmentId || !courseId) {
            return res.status(400).json({ error: "Assignment ID and course ID are required" });
        }

        // 🔍 Search using assignmentId and course code
        const assignment = await Assignment.findOne({
            assignmentId: { $regex: new RegExp(`^${assignmentId}$`, "i") },
            course: { $regex: new RegExp(`^${courseId}$`, "i") }
        });

        if (!assignment) {
            console.log("❌ Assignment not found");
            return res.status(404).json({ error: "Assignment not found for this course" });
        }

        console.log("✅ Assignment Found. Submissions:", assignment.submissions.length);
        res.status(200).json({ submissions: assignment.submissions });

    } catch (error) {
        console.error("❌ Error fetching submissions:", error);
        res.status(500).json({ error: "Error fetching submissions", details: error.message });
    }
};
