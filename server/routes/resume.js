const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for resumes
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   GET /api/resumes
// @desc    Get all resumes (metadata only)
// @access  Public
router.get('/', resumeController.getAllResumes);

// @route   POST /api/resumes/:rollNumber
// @desc    Upload student resume
// @access  Public
router.post('/:rollNumber', upload.single('resume'), resumeController.uploadResume);

// @route   GET /api/resumes/:rollNumber
// @desc    Get student resume (download)
// @access  Public
router.get('/:rollNumber', resumeController.getResume);

// @route   GET /api/resumes/:rollNumber/info
// @desc    Get resume metadata
// @access  Public
router.get('/:rollNumber/info', resumeController.getResumeInfo);

// @route   GET /api/resumes/:rollNumber/exists
// @desc    Check if resume exists
// @access  Public
router.get('/:rollNumber/exists', resumeController.checkResumeExists);

// @route   DELETE /api/resumes/:rollNumber
// @desc    Delete student resume
// @access  Public
router.delete('/:rollNumber', resumeController.deleteResume);

module.exports = router;
