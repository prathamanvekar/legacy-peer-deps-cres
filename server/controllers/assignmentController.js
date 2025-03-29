const Assignment = require("../models/Assignment");

/// Get all submissions for an assignment by title and courseId
exports.getSubmissions = async (req, res) => {
    try {
        const { assignmentTitle, courseId } = req.params;

        // Ensure courseId and assignmentTitle exist
        if (!assignmentTitle || !courseId) {
            return res.status(400).json({ error: "Assignment title and course ID are required" });
        }

        // Find the assignment using the exact courseId (e.g., "COURSE-6588") and assignment title
        const assignment = await Assignment.findOne({ title: assignmentTitle, course: courseId })
            .populate("submissions.student", "name");

        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found for this course" });
        }

        res.status(200).json(assignment.submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "Error fetching submissions", details: error.message });
    }
};