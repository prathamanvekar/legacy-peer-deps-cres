const express = require("express");
const { getResources } = require("../controllers/studentResourceController");
const router = express.Router();

router.get("/:courseId/resources", getResources);

module.exports = router;
