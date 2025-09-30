const { validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Store = require('../models/Store');

exports.submitRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Verify store exists
    const store = await Store.findById(store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const ratingId = await Rating.createOrUpdate({ user_id, store_id, rating });
    
    res.json({
      message: 'Rating submitted successfully',
      rating: {
        id: ratingId,
        user_id,
        store_id,
        rating
      }
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const ratings = await Rating.getUserRatings(user_id);
    
    res.json({ ratings });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStoreWithUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user_id = req.user.id;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const userRating = await Rating.getUserRating(user_id, parseInt(storeId));

    res.json({
      store: {
        ...store,
        user_rating: userRating ? userRating.rating : null
      }
    });
  } catch (error) {
    console.error('Get store with user rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};