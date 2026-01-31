const User = require('../models/User');
const UserLinks = require('../models/UserLinks');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      leetcode,
      hackerrank,
      codeforces,
      codechef,
      atcoder,
      geeksforgeeks,
      hackerearth
    } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and rollNumber'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const existingRoll = await User.findOne({ rollNumber });
    if (existingRoll) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this roll number'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      rollNumber: rollNumber.trim()
    });

    const userLinks = await UserLinks.create({
      userId: user._id,
      rollNumber: rollNumber.trim(),
      leetcode: leetcode?.trim() || '',
      hackerrank: hackerrank?.trim() || '',
      codeforces: codeforces?.trim() || '',
      codechef: codechef?.trim() || '',
      atcoder: atcoder?.trim() || '',
      geeksforgeeks: geeksforgeeks?.trim() || '',
      hackerearth: hackerearth?.trim() || ''
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          rollNumber: user.rollNumber
        },
        links: userLinks
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

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, rollNumber } = req.body;

    if ((!email && !rollNumber) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide (email or roll number) and password'
      });
    }

    let user;
    if (rollNumber) {
      user = await User.findOne({ rollNumber: rollNumber.trim() });
    } else {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    let userLinks = await UserLinks.findOne({ userId: user._id });
    if (!userLinks) {
      userLinks = await UserLinks.create({
        userId: user._id,
        rollNumber: user.rollNumber
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          rollNumber: user.rollNumber
        },
        links: userLinks
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
