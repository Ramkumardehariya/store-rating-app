const { pool } = require('../config/database');

class Rating {
  static async createOrUpdate(ratingData) {
    const { user_id, store_id, rating } = ratingData;
    
    // Check if rating exists
    const [existing] = await pool.execute(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existing.length > 0) {
      // Update existing rating
      await pool.execute(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, user_id, store_id]
      );
      return existing[0].id;
    } else {
      // Create new rating
      const [result] = await pool.execute(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [user_id, store_id, rating]
      );
      return result.insertId;
    }
  }

  static async getUserRating(userId, storeId) {
    const [rows] = await pool.execute(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    return rows[0];
  }

  static async getRatingsCount() {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM ratings');
    return rows[0].count;
  }

  static async getUserRatings(userId) {
    const [rows] = await pool.execute(
      `SELECT r.*, s.name as store_name, s.address as store_address
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = Rating;