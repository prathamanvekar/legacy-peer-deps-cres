const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from parent .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import models
const Student = require('./models/student');
const Trainer = require('./models/trainer');
const Admin = require('./models/admin');
const Assignment = require('./models/assignment');
const Course = require('./models/course');
const StudentResource = require('./models/studentResource');

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Route to fetch all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// ✅ Optional: Seed all models to create collections (run once)
const seedModels = async () => {
  await Student.create({ name: 'Test Student', email: 'student@example.com' });
  await Trainer.create({ name: 'Test Trainer', expertise: 'Web Dev' });
  await Admin.create({ username: 'admin1', password: 'securepass' });
  await Assignment.create({ title: 'Intro Assignment', description: 'First task' });
  await Course.create({ title: 'Course 101', description: 'Basics of Web Dev' });
  await StudentResource.create({ title: 'Lecture PDF', link: 'https://example.com/resource.pdf' });

  console.log('✅ Test data inserted');
};

// Uncomment to run seeding once, then comment it again
// seedModels();

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
