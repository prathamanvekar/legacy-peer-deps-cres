const Assignment = require("../models/assignment");

// ✅ Get all submissions for an assignment by title and courseId
exports.getSubmissions = async (req, res) => {
    try {
        const { assignmentTitle, courseId } = req.params;

        console.log("🔍 Debugging getSubmissions:");
        console.log("Received Course ID:", courseId);
        console.log("Received Assignment Title:", assignmentTitle);

        if (!assignmentTitle || !courseId) {
            return res.status(400).json({ error: "Assignment title and course ID are required" });
        }

        // 🔍 Search for assignment using title and course code (stored as string, not ObjectId)
        const assignment = await Assignment.findOne({
            title: { $regex: new RegExp(`^${assignmentTitle}$`, "i") },
            course: { $regex: new RegExp(`^${courseId}$`, "i") }  // course: "COURSE-6588"
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
