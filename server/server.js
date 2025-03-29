const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const admin = require("firebase-admin");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Load environment variables from parent .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import models
const Student = require("./models/student");
const Trainer = require("./models/trainer");
const Admin = require("./models/admin");
const Assignment = require("./models/assignment");
const Course = require("./models/course");
const StudentResource = require("./models/studentResource");
const File = require("./models/file"); // New model for storing file metadata

// ✅ Firebase Admin SDK Initialization
const serviceAccount = require("../firebase-adminsdk.json"); // Ensure this file is in the root and ignored in .gitignore

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ppt-access-hack.firebasestorage.app", // Set in .env
});

const bucket = admin.storage().bucket();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Route to fetch all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ File Upload Setup
const upload = multer({ dest: "uploads/" });

// ✅ File Upload Endpoint (PPT, PDF, DOC Upload to Firebase Storage)
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const fileExtension = originalName.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  try {
    // Upload file to Firebase Storage
    await bucket.upload(filePath, {
      destination: `uploads/${fileName}`,
      metadata: { contentType: req.file.mimetype },
    });

    // Get the download URL
    const [url] = await bucket.file(`uploads/${fileName}`).getSignedUrl({
      action: "read",
      expires: "03-09-2030", // Adjust expiration if needed
    });

    // Save file metadata in MongoDB
    const newFile = new File({ filename: originalName, url });
    await newFile.save();

    // Clean up local temp file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "File uploaded successfully", url });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Upload failed");
  }
});

// ✅ Retrieve Uploaded Files
app.get("/files", async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch files");
  }
});

// ✅ Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
