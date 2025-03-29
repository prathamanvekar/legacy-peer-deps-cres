const express = require("express");
const { addTrainer, getTotalStudents, getStudentsInCourse, getTotalTrainers, getAllCourses, getAllAssignments } = require("../controllers/adminController");
const router = express.Router();

router.post("/addtrainer", addTrainer);
router.get("/students", getTotalStudents);
router.get("/students/:courseId", getStudentsInCourse);
router.get("/trainers", getTotalTrainers);
router.get("/courses", getAllCourses);
router.get("/assignments", getAllAssignments);

module.exports = router;
