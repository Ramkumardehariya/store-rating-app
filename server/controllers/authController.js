const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const userId = await User.create({ name, email, password, address, role });
    
    // Generate token
    const token = generateToken(userId);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        address,
        role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Provide more specific error messages for database issues
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ 
        error: 'Database connection failed. Please check your database configuration.',
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, password: newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findByEmail(req.user.email);
    
    // Verify current password
    const isValidPassword = await User.verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    await User.updatePassword(userId, newPassword);
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};