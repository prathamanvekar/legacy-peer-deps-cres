const express = require("express");
const studentController = require("../controllers/studentController");

const router = express.Router();

// Verify if functions exist before using them
if (!studentController.joinCourse || !studentController.submitAssignment || !studentController.getCourseResources) {
    console.error("❌ Error: One or more functions are not properly imported in studentRoutes.");
} else {
    console.log("✅ All functions imported successfully.");
}

router.post("/joincourse", studentController.joinCourse);
router.post("/submitassignment", studentController.submitAssignment);
router.get("/:courseId/resources", studentController.getCourseResources);
router.post("/signup", studentController.addStudent);


module.exports = router;
