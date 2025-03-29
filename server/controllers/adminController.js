const Admin = require("../models/Admin");
const Trainer = require("../models/Trainer");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");

exports.addTrainer = async (req, res) => {
    try {
      console.log('🔹 Received request:', req.body); // ✅ Log request payload
  
      const { name, email, password, expertise, contactNumber } = req.body;
  
      if (!name || !email || !password || !expertise || !contactNumber) {
        console.log('❌ Missing required fields:', { name, email, password, expertise, contactNumber });
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const existingTrainer = await Trainer.findOne({ email });
      if (existingTrainer) {
        console.log('❌ Trainer already exists:', email);
        return res.status(400).json({ message: 'Trainer already exists' });
      }
  
      const trainer = new Trainer({ name, email, password, expertise, contactNumber });
      await trainer.save();
  
      console.log('✅ Trainer added successfully:', trainer);
      res.status(201).json({ message: 'Trainer added successfully', trainer });
    } catch (error) {
      console.error('❌ Error adding trainer:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };



// Get total number of students
exports.getTotalStudents = async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        res.status(200).json({ totalStudents: studentCount });
    } catch (error) {
        res.status(500).json({ error: "Error fetching student count" });
    }
};

// Get total number of students in a specific course
exports.getStudentsInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const students = await Student.find({ enrolledCourses: courseId });
        res.status(200).json({ studentsCount: students.length, students });
    } catch (error) {
        res.status(500).json({ error: "Error fetching students for course" });
    }
};

// Get total number of trainers
exports.getTotalTrainers = async (req, res) => {
    try {
        const trainerCount = await Trainer.countDocuments();
        res.status(200).json({ totalTrainers: trainerCount });
    } catch (error) {
        res.status(500).json({ error: "Error fetching trainer count" });
    }
};

// Get all courses created by all trainers
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("trainer", "name");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: "Error fetching courses" });
    }
};

// Get all assignments
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate("courseId", "title");
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Error fetching assignments" });
    }
};
