const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const leetcodeRoutes = require('./routes/platform');
const pdfRoutes = require('./routes/pdf');
const resumeRoutes = require('./routes/resume');
const certificationRoutes = require('./routes/certifications');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/platform', leetcodeRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/certifications', certificationRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const conn = await connectDB();
  console.log(`MongoDB connected: ${conn.connection.host}`);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
