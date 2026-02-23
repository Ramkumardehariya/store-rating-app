const { pool } = require('../config/database');

class Rating {
  static async createOrUpdate(ratingData) {
    const { user_id, store_id, rating } = ratingData;
    
    // Check if rating exists
    const existing = await pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id]
    );

    if (existing.rows.length > 0) {
      // Update existing rating
      await pool.query(
        'UPDATE ratings SET rating = $1, updated_at = NOW() WHERE user_id = $2 AND store_id = $3',
        [rating, user_id, store_id]
      );
      return existing.rows[0].id;
    } else {
      // Create new rating
      const result = await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
        [user_id, store_id, rating]
      );
      return result.rows[0].id;
    }
  }

  static async getUserRating(userId, storeId) {
    const result = await pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );
    return result.rows[0];
  }

  static async getRatingsCount() {
    const result = await pool.query('SELECT COUNT(*) as count FROM ratings');
    return result.rows[0].count;
  }

  static async getUserRatings(userId) {
    const result = await pool.query(
      `SELECT r.*, s.name as store_name, s.address as store_address
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Rating;