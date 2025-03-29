const express = require("express");
const { getResources } = require("../controllers/studentResource.Controller");
const router = express.Router();

router.get("/:courseId/resources", getResources);

module.exports = router;
