const Trainer = require("../models/Trainer");
const Course = require("../models/Course");
const Assignment = require("../models/assignment");
const Student = require("../models/Student");

// ✅ Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { title, description, trainerName } = req.body;

        if (!title || !description || !trainerName) {
            return res.status(400).json({ error: "Title, description, and trainer name are required" });
        }

        // Find trainer by name
        const trainer = await Trainer.findOne({ name: trainerName });

        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        // Generate a unique course ID
        const courseId = `COURSE-${Math.floor(1000 + Math.random() * 9000)}`;

        // Create course with trainer ID
        const newCourse = new Course({
            courseId, // ✅ Assigning the unique course ID
            title,
            description,
            trainer: trainer._id
        });

        await newCourse.save();
        res.status(201).json({ 
            message: "Course created successfully", 
            course: { 
                id: newCourse._id, 
                courseId: newCourse.courseId, 
                title: newCourse.title, 
                description: newCourse.description, 
                trainerName 
            } 
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Error creating course", details: error.message });
    }
};


// ✅ Upload a resource for a course
exports.uploadResource = async (req, res) => {
    try {
        const { courseId, resourceUrl } = req.body;

        if (!courseId || !resourceUrl) {
            return res.status(400).json({ error: "Course ID and resource URL are required" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        course.resources.push(resourceUrl);
        await course.save();

        res.status(200).json({ message: "Resource uploaded successfully", course });
    } catch (error) {
        res.status(500).json({ error: "Error uploading resource" });
    }
};

// ✅ Create an assignment

exports.createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, dueDate } = req.body; // ✅ Include description

        if (!courseId || !title || !description || !dueDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ Find the Course using courseId
        const course = await Course.findOne({ courseId });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // ✅ Find Trainer from Course
        const trainer = await Trainer.findById(course.trainer);
        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        // ✅ Create a new Assignment
        const newAssignment = new Assignment({
            title,
            description, // ✅ Added description
            deadline: new Date(dueDate), // ✅ Match with schema (deadline instead of dueDate)
            course: course._id, // Store ObjectId reference
            courseTitle: course.title, // ✅ Store course title
            trainer: trainer._id, // ✅ Store trainer reference
        });

        await newAssignment.save();

        // ✅ Step 3: Update Course Model (Add Assignment Title)
        course.assignments.push({ assignmentId: newAssignment._id, title });
        await course.save();

        res.status(201).json({ 
            message: "Assignment created successfully", 
            assignment: newAssignment 
        });

    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ error: "Error creating assignment", details: error.message });
    }
};


// ✅ View registered students in trainer's courses
exports.getRegisteredStudents = async (req, res) => {
    try {
        const courses = await Course.find({ trainer: req.trainer.id });
        const studentList = [];

        for (const course of courses) {
            const students = await Student.find({ enrolledCourses: course._id }, "name email");
            studentList.push({ courseTitle: course.title, students });
        }

        res.status(200).json(studentList);
    } catch (error) {
        res.status(500).json({ error: "Error fetching registered students" });
    }
};
