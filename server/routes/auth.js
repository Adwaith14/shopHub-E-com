const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
   try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
         return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
         });
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
         return res.status(400).json({
            success: false,
            message: 'User already exists with this email'
         });
      }

      // Create user (password will be hashed by pre-save middleware)
      const user = await User.create({
         name,
         email,
         password
      });

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '30d'
      });

      res.status(201).json({
         success: true,
         token,
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
         }
      });
   } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
         success: false,
         message: 'Server error during registration'
      });
   }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
         });
      }

      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
         return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
         });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
         });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '30d'
      });

      res.json({
         success: true,
         token,
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
         }
      });
   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
         success: false,
         message: 'Server error during login'
      });
   }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
   try {
      res.json({
         success: true,
         user: req.user
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Server error'
      });
   }
});

module.exports = router;
