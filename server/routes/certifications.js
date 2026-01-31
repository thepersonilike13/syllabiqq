const express = require('express');
const router = express.Router();
const multer = require('multer');
const Certification = require('../models/Certification');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'), false);
    }
  }
});

// Upload a new certification
router.post('/', upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { name, organization, userId } = req.body;

    if (!name || !organization) {
      return res.status(400).json({ 
        success: false, 
        message: 'Certificate name and organization are required' 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const certification = new Certification({
      userId,
      name,
      organization,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      size: req.file.size
    });

    await certification.save();

    res.status(201).json({
      success: true,
      message: 'Certification uploaded successfully',
      data: {
        _id: certification._id,
        name: certification.name,
        organization: certification.organization,
        size: certification.size,
        createdAt: certification.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading certification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all certifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const certifications = await Certification.find({ userId: req.params.userId })
      .select('-data')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: certifications
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Download a certification by ID
router.get('/:id', async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    res.set({
      'Content-Type': certification.contentType,
      'Content-Disposition': `attachment; filename="${certification.name}.pdf"`
    });

    res.send(certification.data);
  } catch (error) {
    console.error('Error downloading certification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a certification
router.delete('/:id', async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);

    if (!certification) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    res.json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
