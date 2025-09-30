const { pool } = require('../config/database');

class Store {
  static async create(storeData) {
    const { name, email, address, owner_id } = storeData;
    
    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
  const query = `
    SELECT s.*, u.name as owner_name, u.email as owner_email
    FROM stores s
    LEFT JOIN users u ON s.owner_id = u.id
    WHERE u.email = ?
  `;
  const [rows] = await pool.execute(query, [email]);
  return rows.length ? rows[0] : null;
}


  static async findAll(filters = {}) {
    let query = `
      SELECT s.*, 
             u.name as owner_name,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    query += ' GROUP BY s.id';

    // Add sorting
    if (filters.sortBy) {
      const validColumns = ['name', 'email', 'address', 'average_rating', 'total_ratings'];
      if (validColumns.includes(filters.sortBy)) {
        query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
      }
    } else {
      query += ' ORDER BY s.created_at DESC';
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT s.*, 
              u.name as owner_name,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN users u ON s.owner_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = ?
       GROUP BY s.id`,
      [id]
    );
    return rows[0];
  }

  static async findByOwnerId(ownerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM stores WHERE owner_id = ?',
      [ownerId]
    );
    return rows[0];
  }

  static async getStoresCount() {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM stores');
    return rows[0].count;
  }

  static async getStoreRatings(storeId) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return rows;
  }
}

module.exports = Store;