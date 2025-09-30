const { validationResult } = require('express-validator');
const Store = require('../models/Store');
const User = require('../models/User');

exports.createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, owner_id } = req.body;

    // Check if store already exists
    console.log("user is: ", name, email, address, owner_id);
    const [existingStore] = await Store.findAll({ name, email });
    if (existingStore) {
      return res.status(400).json({ error: 'Store already exists with this name or email' });
    }

    // Verify owner exists and is a store owner
    const owner = await User.findById(owner_id);
    if (!owner || owner.role !== 'store_owner') {
      return res.status(400).json({ error: 'Invalid owner. User must have store_owner role' });
    }

    const storeId = await Store.create({ name, email, address, owner_id });
    
    res.status(201).json({
      message: 'Store created successfully',
      store: {
        id: storeId,
        name,
        email,
        address,
        owner_id
      }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    
    const filters = { name, address, sortBy, sortOrder };
    const stores = await Store.findAll(filters);
    
    res.json({ stores });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ store });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStoreOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    const store = await Store.findByOwnerId(ownerId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found for this owner' });
    }

    const storeWithDetails = await Store.findById(store.id);
    const ratings = await Store.getStoreRatings(store.id);

    res.json({
      store: storeWithDetails,
      ratings
    });
  } catch (error) {
    console.error('Get store owner dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};