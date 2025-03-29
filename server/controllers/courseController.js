const Course = require("../models/Course");

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("trainer", "name");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: "Error fetching courses" });
    }
};
