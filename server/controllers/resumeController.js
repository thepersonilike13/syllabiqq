const Pdf = require('../models/Pdf');
const User = require('../models/User');

// Helper to generate resume name from roll number
const getResumeName = (rollNumber) => `${rollNumber}_resume.pdf`;

// @desc    Upload student resume
// @route   POST /api/resumes/:rollNumber
// @access  Public
exports.uploadResume = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    // Verify student exists
    const student = await User.findOne({ rollNumber: rollNumber.trim() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with this roll number'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const resumeName = getResumeName(rollNumber.trim());

    // Check if resume already exists, update if so
    let pdf = await Pdf.findOne({ name: resumeName });

    if (pdf) {
      // Update existing resume
      pdf.data = req.file.buffer;
      pdf.contentType = req.file.mimetype;
      pdf.size = req.file.size;
      pdf.updatedAt = Date.now();
      await pdf.save();

      return res.status(200).json({
        success: true,
        message: 'Resume updated successfully',
        data: {
          id: pdf._id,
          name: pdf.name,
          rollNumber: rollNumber.trim(),
          size: pdf.size,
          updatedAt: pdf.updatedAt
        }
      });
    }

    // Create new resume
    pdf = await Pdf.create({
      name: resumeName,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: student._id
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        id: pdf._id,
        name: pdf.name,
        rollNumber: rollNumber.trim(),
        size: pdf.size,
        createdAt: pdf.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student resume by roll number
// @route   GET /api/resumes/:rollNumber
// @access  Public
exports.getResume = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    const resumeName = getResumeName(rollNumber.trim());
    const pdf = await Pdf.findOne({ name: resumeName });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found for this student'
      });
    }

    res.set({
      'Content-Type': pdf.contentType,
      'Content-Disposition': `inline; filename="${resumeName}"`,
      'Content-Length': pdf.size
    });

    res.send(pdf.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get resume info (metadata only)
// @route   GET /api/resumes/:rollNumber/info
// @access  Public
exports.getResumeInfo = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    const resumeName = getResumeName(rollNumber.trim());
    const pdf = await Pdf.findOne({ name: resumeName }).select('-data');

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found for this student'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: pdf._id,
        name: pdf.name,
        rollNumber: rollNumber.trim(),
        size: pdf.size,
        contentType: pdf.contentType,
        createdAt: pdf.createdAt,
        updatedAt: pdf.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete student resume
// @route   DELETE /api/resumes/:rollNumber
// @access  Public
exports.deleteResume = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    const resumeName = getResumeName(rollNumber.trim());
    const pdf = await Pdf.findOneAndDelete({ name: resumeName });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found for this student'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Check if student has resume
// @route   GET /api/resumes/:rollNumber/exists
// @access  Public
exports.checkResumeExists = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    const resumeName = getResumeName(rollNumber.trim());
    const pdf = await Pdf.findOne({ name: resumeName }).select('_id');

    res.status(200).json({
      success: true,
      exists: !!pdf,
      rollNumber: rollNumber.trim()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all resumes (metadata only)
// @route   GET /api/resumes
// @access  Public
exports.getAllResumes = async (req, res) => {
  try {
    const pdfs = await Pdf.find({ name: /_resume\.pdf$/ }).select('-data');

    const resumes = pdfs.map(pdf => ({
      id: pdf._id,
      name: pdf.name,
      rollNumber: pdf.name.replace('_resume.pdf', ''),
      size: pdf.size,
      createdAt: pdf.createdAt,
      updatedAt: pdf.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
