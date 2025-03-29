const express = require("express");
const { getSubmissions } = require("../controllers/assignmentController");
const router = express.Router();

router.get("/submissions/:courseId/:assignmentTitle", studentController.getSubmissions);

module.exports = router;
