const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Import CORS
const connectDB = require('./config/db');

// ✅ Import Routes
const adminRoutes = require('./routes/adminRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const studentRoutes = require('./routes/studentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentResourceRoutes = require('./routes/studentResourceRoutes');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, './.env') });

// ✅ Initialize express app
const app = express();

// ✅ Enable CORS for frontend (http://localhost:8080)
app.use(cors({
  origin: 'http://localhost:8080', // Allow frontend requests
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  });

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Define Routes
app.use('/api/admin', adminRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student/resources', studentResourceRoutes);

// ✅ Check MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connection is Active');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Connection Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Disconnected');
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
