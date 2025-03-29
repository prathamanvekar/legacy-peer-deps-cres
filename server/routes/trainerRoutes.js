const express = require("express");
const {
    createCourse,
    uploadResource,
    createAssignment,
    getRegisteredStudents
} = require("../controllers/trainerController");

const router = express.Router();

router.post("/createcourse", createCourse);
router.post("/uploadresource", uploadResource);
router.post("/createassignment", createAssignment);
router.get("/registeredstudents", getRegisteredStudents);

module.exports = router;
