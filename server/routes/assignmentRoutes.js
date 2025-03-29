const express = require("express");
const { getSubmissions } = require("../controllers/assignmentController"); // ✅ Correct import

const router = express.Router();

router.get("/submissions/:courseId/:assignmentId", getSubmissions);

module.exports = router;
