const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   POST /api/pdfs
// @desc    Store a new PDF
// @access  Public
router.post('/', upload.single('pdf'), pdfController.storePdf);

// @route   GET /api/pdfs
// @desc    Get all PDFs (metadata only)
// @access  Public
router.get('/', pdfController.getAllPdfs);

// @route   GET /api/pdfs/:name
// @desc    Get PDF by name (returns file)
// @access  Public
router.get('/:name', pdfController.getPdfByName);

// @route   GET /api/pdfs/:name/info
// @desc    Get PDF metadata by name
// @access  Public
router.get('/:name/info', pdfController.getPdfInfoByName);

// @route   PUT /api/pdfs/:name
// @desc    Update PDF by name
// @access  Public
router.put('/:name', upload.single('pdf'), pdfController.updatePdfByName);

// @route   DELETE /api/pdfs/:name
// @desc    Delete PDF by name
// @access  Public
router.delete('/:name', pdfController.deletePdfByName);

module.exports = router;
