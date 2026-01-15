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

exports.updateStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Check if store exists
    const existingStore = await Store.findById(id);
    if (!existingStore) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Authorization checks
    if (userRole === 'admin') {
      // Admin can update any store and reassign ownership
      // Check if new owner already has a store (when owner_id is being changed)
      if (owner_id !== undefined && owner_id !== existingStore.owner_id) {
        const ownerHasStore = await Store.checkOwnerExists(owner_id, id);
        if (ownerHasStore) {
          return res.status(400).json({ error: 'New owner already has a store assigned' });
        }

        // Verify new owner exists and is a store owner
        const newOwner = await User.findById(owner_id);
        if (!newOwner || newOwner.role !== 'store_owner') {
          return res.status(400).json({ error: 'Invalid owner. User must have store_owner role' });
        }
      }
    } else if (userRole === 'store_owner') {
      // Store owner can only update their own store
      if (existingStore.owner_id !== userId) {
        return res.status(403).json({ error: 'Access denied. You can only update your own store' });
      }

      // Store owners cannot change store name or owner
      if (name !== undefined && name !== existingStore.name) {
        return res.status(403).json({ error: 'Store owners cannot change store name' });
      }

      if (owner_id !== undefined && owner_id !== existingStore.owner_id) {
        return res.status(403).json({ error: 'Store owners cannot reassign store ownership' });
      }
    } else {
      // Normal users cannot update stores
      return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
    }

    // Check for empty updates
    const updateData = {};
    if (name !== undefined && name !== existingStore.name) updateData.name = name;
    if (email !== undefined && email !== existingStore.email) updateData.email = email;
    if (address !== undefined && address !== existingStore.address) updateData.address = address;
    if (owner_id !== undefined && owner_id !== existingStore.owner_id) updateData.owner_id = owner_id;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No changes detected' });
    }

    // Check if store name or email already exists (excluding current store)
    if (updateData.name || updateData.email) {
      const [duplicateStore] = await Store.findAll({ 
        name: updateData.name, 
        email: updateData.email 
      });
      
      if (duplicateStore && duplicateStore.id !== parseInt(id)) {
        return res.status(400).json({ 
          error: 'Store already exists with this name or email' 
        });
      }
    }

    // Update store
    const updated = await Store.update(id, updateData, userId, userRole);
    
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update store' });
    }

    // Get updated store data
    const updatedStore = await Store.findById(id);

    res.json({
      message: 'Store updated successfully',
      store: updatedStore
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};