const express = require("express");
const {
    createCourse,
    uploadResource,
    createAssignment,
    getStudentCountForCourse,       // 🆕 Get number of students for a course
    getTotalRegisteredStudents      // 🆕 Get total registered students
} = require("../controllers/trainerController");

const router = express.Router();

// -----------------------------------
// 📘 Trainer Routes
// -----------------------------------

// ✅ Create a new course
router.post("/createcourse", createCourse);

// ✅ Upload a resource to a course
router.post("/uploadresource", uploadResource);

// ✅ Create an assignment for a course
router.post("/createassignment", createAssignment);

// ✅ Get students registered in trainer's courses (requires ?trainerId=xyz)

// ✅🆕 Get student count for a specific course (requires ?courseId=COURSE-xxxx)
router.get("/studentcount", getStudentCountForCourse);

// ✅🆕 Get total number of students registered on the platform
router.get("/totalstudents", getTotalRegisteredStudents);

module.exports = router;
