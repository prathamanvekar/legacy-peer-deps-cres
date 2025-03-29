const StudentResource = require("../models/StudentResource");

// Get resources for a course
exports.getResources = async (req, res) => {
    try {
        const { courseId } = req.params;
        const resources = await StudentResource.find({ courseId });
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: "Error fetching resources" });
    }
};
