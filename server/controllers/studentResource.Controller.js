const StudentResource = require("../models/StudentResource");

// Get resources for a course

exports.getResources = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const resources = await StudentResource.find({}).populate("course", "courseId");
  
      // Filter on course.courseId
      const filteredResources = resources.filter(resource => resource.course?.courseId === courseId);
  
      if (!filteredResources.length) {
        return res.status(404).json({ message: "No resources found for this course" });
      }
  
      res.status(200).json(filteredResources);
    } catch (error) {
      console.error("Error fetching student resources:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };