const Pdf = require('../models/Pdf');

// @desc    Store a new PDF
// @route   POST /api/pdfs
// @access  Public
exports.storePdf = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a PDF name'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    // Check if PDF with this name already exists
    const existingPdf = await Pdf.findOne({ name: name.trim() });
    if (existingPdf) {
      return res.status(400).json({
        success: false,
        message: 'A PDF with this name already exists'
      });
    }

    const pdf = await Pdf.create({
      name: name.trim(),
      data: req.file.buffer,
      contentType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.body.userId || null
    });

    res.status(201).json({
      success: true,
      message: 'PDF stored successfully',
      data: {
        id: pdf._id,
        name: pdf.name,
        size: pdf.size,
        contentType: pdf.contentType,
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

// @desc    Get PDF by name
// @route   GET /api/pdfs/:name
// @access  Public
exports.getPdfByName = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ name: req.params.name });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    res.set({
      'Content-Type': pdf.contentType,
      'Content-Disposition': `inline; filename="${pdf.name}.pdf"`,
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

// @desc    Get PDF metadata by name (without file data)
// @route   GET /api/pdfs/:name/info
// @access  Public
exports.getPdfInfoByName = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ name: req.params.name }).select('-data');

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pdf
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

// @desc    Delete PDF by name
// @route   DELETE /api/pdfs/:name
// @access  Public
exports.deletePdfByName = async (req, res) => {
  try {
    const pdf = await Pdf.findOneAndDelete({ name: req.params.name });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'PDF deleted successfully'
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

// @desc    Get all PDFs (metadata only)
// @route   GET /api/pdfs
// @access  Public
exports.getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find().select('-data');

    res.status(200).json({
      success: true,
      count: pdfs.length,
      data: pdfs
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

// @desc    Update PDF by name (replace file)
// @route   PUT /api/pdfs/:name
// @access  Public
exports.updatePdfByName = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ name: req.params.name });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    pdf.data = req.file.buffer;
    pdf.contentType = req.file.mimetype;
    pdf.size = req.file.size;
    pdf.updatedAt = Date.now();

    await pdf.save();

    res.status(200).json({
      success: true,
      message: 'PDF updated successfully',
      data: {
        id: pdf._id,
        name: pdf.name,
        size: pdf.size,
        contentType: pdf.contentType,
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
