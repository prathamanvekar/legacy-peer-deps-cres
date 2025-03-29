const Trainer = require("../models/Trainer");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");
// ✅ Create a new course (No Trainer Lookup)
exports.createCourse = async (req, res) => {
    try {
        console.log("Incoming request:", req.body);  // ✅ Log request data

        const { courseId, title, description, trainerName } = req.body;

        if (!courseId || !title || !description || !trainerName) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const trainer = await Trainer.findOne({ name: trainerName });

        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        const newCourse = new Course({
            courseId,
            title,
            description,
            trainer: trainer._id
        });

        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", course: newCourse });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};




// ✅ Upload a resource for a course
exports.uploadResource = async (req, res) => {
    try {
      const { courseId, resourceUrl } = req.body;
  
      if (!courseId || !resourceUrl) {
        return res.status(400).json({ error: "Course ID and resource URL are required" });
      }
  
      const course = await Course.findOne({ courseId }); // ✅ using courseId string
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      course.resources.push(resourceUrl); // ✅ add resource to array
      await course.save();
  
      res.status(200).json({ message: "Resource uploaded successfully", course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading resource" });
    }
  };

// ✅ Create an assignment


// Utility function to generate a unique assignment ID
function generateAssignmentId() {
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `ASSIGN-${random}`;
}

exports.createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, deadline } = req.body;

        if (!courseId || !title || !deadline) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ Step 1: Find the Course using courseId (e.g., "COURSE-6588")
        const course = await Course.findOne({ courseId });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // ✅ Step 2: Generate a unique assignmentId
        let assignmentId;
        let exists = true;
        while (exists) {
            assignmentId = generateAssignmentId();
            const existing = await Assignment.findOne({ assignmentId });
            if (!existing) exists = false;
        }

        // ✅ Step 3: Create Assignment
        const newAssignment = new Assignment({
            assignmentId,                       // 🔹 Custom assignment ID
            title,
            description,
            deadline,
            course: course.courseId,            // "COURSE-xxxx"
            courseTitle: course.title,          // Course title
            trainer: course.trainer             // Reference to Trainer
        });

        await newAssignment.save();

        res.status(201).json({ 
            message: "Assignment created successfully", 
            assignment: newAssignment 
        });

    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ 
            error: "Error creating assignment", 
            details: error.message 
        });
    }
};


// ✅ View registered students in a specific course
exports.getStudentCountForCourse = async (req, res) => {
    try {
        const { courseId } = req.query;

        if (!courseId) {
            return res.status(400).json({ error: "Course ID is required in query params" });
        }

        const count = await Student.countDocuments({ enrolledCourses: courseId });

        res.status(200).json({
            courseId,
            studentCount: count
        });
    } catch (error) {
        console.error("Error counting students for course:", error);
        res.status(500).json({ error: "Failed to count registered students", details: error.message });
    }
};


// ✅ View total registered students
exports.getTotalRegisteredStudents = async (req, res) => {
    try {
        const total = await Student.countDocuments({});
        res.status(200).json({ totalRegisteredStudents: total });
    } catch (error) {
        console.error("Error getting total students:", error);
        res.status(500).json({ error: "Error fetching total students", details: error.message });
    }
};
