const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // ✅ Import mongoose
const connectDB = require('./config/db');

// ✅ Import Routes (Before Middleware)
const adminRoutes = require('./routes/adminRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const studentRoutes = require('./routes/studentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes'); // Ensure this is included


// Load environment variables from parent .env
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Initialize express app
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL-encoded middleware

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1); // Exit process on DB connection failure
  });

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Define Routes
app.use('/api/admin', adminRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/student', studentRoutes);
app.use("/api", assignmentRoutes); // Ensure this is included


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

// ✅ Server Port
const PORT = process.env.PORT || 5000;

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
