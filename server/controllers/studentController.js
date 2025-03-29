const Student = require("../models/Student");
const Course = require("../models/Course");
const Assignment = require("../models/assignment");
const StudentResource = require("../models/StudentResource");

// Function to access resources in enrolled courses
exports.getCourseResources = async (req, res) => {
    try {
        const { courseId } = req.params;
        const resources = await StudentResource.find({ courseId });
        res.status(200).json(resources);
    } catch (error) {
        console.error("Error fetching course resources:", error);
        res.status(500).json({ error: "Error fetching course resources" });
    }
};

// ✅ Function to Add a Student
exports.addStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: "Student already exists" });
        }

        // Create new student
        const newStudent = new Student({ name, email, password });
        await newStudent.save();

        res.status(201).json({ message: "Student added successfully", student: newStudent });
    } catch (error) {
        res.status(500).json({ error: "Error adding student", details: error.message });
    }
};

// Function to join a course using email instead of studentId
const mongoose = require("mongoose");
exports.joinCourse = async (req, res) => {
    try {
        const { email, courseId } = req.body;

        if (!email || !courseId) {
            return res.status(400).json({ error: "Student email and course ID are required" });
        }

        // 🔹 Find the course using courseId instead of _id
        const course = await Course.findOne({ courseId });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // 🔹 Use the actual MongoDB _id
        const courseObjectId = course._id;

        // 🔹 Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: `No student found with email: ${email}` });
        }

        // Ensure the 'courses' field is an array
        if (!Array.isArray(student.courses)) {
            student.courses = [];
        }

        // Check if already enrolled
        if (student.courses.includes(courseObjectId)) {
            return res.status(400).json({ error: "Student is already enrolled in this course" });
        }

        // 🔹 Add course _id to student courses
        student.courses.push(courseObjectId);
        await student.save();

        res.status(200).json({ message: "Successfully joined course", student });
    } catch (error) {
        console.error("Error joining course:", error);
        res.status(500).json({ error: "Error joining course", details: error.message });
    }
};


// Function to submit an assignment using courseId (like "COURSE-6588")
// Function to submit an assignment using courseId (like "COURSE-6588")
exports.submitAssignment = async (req, res) => {
    try {
        const { studentEmail, courseId, assignmentTitle, fileUrl } = req.body;

        // 🔹 Validate input
        if (!studentEmail || !courseId || !assignmentTitle || !fileUrl) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // 🔹 Check if student exists
        const student = await Student.findOne({ email: studentEmail });
        if (!student) return res.status(404).json({ error: "Student not found" });

        // 🔹 Check if course exists
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).json({ error: "Course not found" });

        // 🔹 Find the assignment
        const assignment = await Assignment.findOne({ title: assignmentTitle, course: courseId });
        if (!assignment) return res.status(404).json({ error: "Assignment not found" });

        // 🔹 Check if already submitted using email
        const alreadySubmitted = assignment.submissions.some(
            sub => sub.studentEmail === studentEmail
        );
        if (alreadySubmitted) {
            return res.status(400).json({ error: "Assignment already submitted" });
        }

        // 🔹 Push the submission
        assignment.submissions.push({
            studentEmail,
            fileUrl
        });

        await assignment.save();

        res.status(200).json({ message: "Assignment submitted successfully" });
    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ error: "Error submitting assignment", details: error.message });
    }
};



// ------------------------------
// 📌 Reminder Scheduler (Runs separately)
// ------------------------------
const schedule = require("node-schedule");
const sendReminder = require("../utils/sendReminder"); // Import function

if (!sendReminder) {
    console.error("❌ Error: sendReminder function is not properly imported.");
}

schedule.scheduleJob("0 0 * * *", async () => { // Runs daily at midnight
    try {
        const now = new Date();
        const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const assignments = await Assignment.find({
            deadline: { $gte: now, $lt: nextDay }
        }).populate("submissions.student");

        for (const assignment of assignments) {
            for (const submission of assignment.submissions) {
                if (!submission.submitted && submission.student?.email) {
                    await sendReminder(submission.student.email, assignment.title, assignment.deadline);
                }
            }
        }
    } catch (error) {
        console.error("❌ Error sending reminders:", error);
    }
});
