const express = require("express");
const { getSubmissions } = require("../controllers/assignmentController"); // ✅ Correct import

const router = express.Router();

router.get("/submissions/:courseId/:assignmentTitle", getSubmissions); // ✅ Use the correct function

module.exports = router;
