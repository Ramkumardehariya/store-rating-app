const { validationResult } = require('express-validator');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.createUser = async (req, res) => {
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

    const userId = await User.create({ name, email, password, address, role });
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId,
        name,
        email,
        address,
        role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;
    
    const filters = { name, email, address, role, sortBy, sortOrder };
    const users = await User.getAllUsers(filters);
    
    // For store owners, get their store rating
    const usersWithRatings = await Promise.all(
      users.map(async (user) => {
        if (user.role === 'store_owner') {
          const store = await Store.findByOwnerId(user.id);
          if (store) {
            const storeWithRating = await Store.findById(store.id);
            user.store_rating = storeWithRating.average_rating;
          }
        }
        return user;
      })
    );

    res.json({ users: usersWithRatings });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let userData = { ...user };
    
    // If user is store owner, get store rating
    if (user.role === 'store_owner') {
      const store = await Store.findByOwnerId(user.id);
      if (store) {
        const storeWithRating = await Store.findById(store.id);
        userData.store_rating = storeWithRating.average_rating;
      }
    }

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.getUsersCount();
    const totalStores = await Store.getStoresCount();
    const totalRatings = await Rating.getRatingsCount();

    res.json({
      stats: {
        totalUsers,
        totalStores,
        totalRatings
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};