const { pool } = require('../config/database');

class Store {
  static async create(storeData) {
    const { name, email, address, owner_id } = storeData;
    
    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, address, owner_id]
    );
    
    return result.rows[0].id;
  }

  static async findByEmail(email) {
  const query = `
    SELECT s.*, u.name as owner_name, u.email as owner_email
    FROM stores s
    LEFT JOIN users u ON s.owner_id = u.id
    WHERE u.email = $1
  `;
  const result = await pool.query(query, [email]);
  return result.rows.length ? result.rows[0] : null;
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
      query += ' AND s.name LIKE $' + (params.length + 1);
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      query += ' AND s.email LIKE $' + (params.length + 1);
      params.push(`%${filters.email}%`);
    }

    if (filters.address) {
      query += ' AND s.address LIKE $' + (params.length + 1);
      params.push(`%${filters.address}%`);
    }

    query += ' GROUP BY s.id, u.name';

    // Add sorting
    if (filters.sortBy) {
      const validColumns = ['name', 'email', 'address', 'average_rating', 'total_ratings'];
      if (validColumns.includes(filters.sortBy)) {
        query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
      }
    } else {
      query += ' ORDER BY s.created_at DESC';
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT s.*, 
              u.name as owner_name,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN users u ON s.owner_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = $1
       GROUP BY s.id, u.name, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at`,
      [id]
    );
    return result.rows[0];
  }

  static async findByOwnerId(ownerId) {
    const result = await pool.query(
      'SELECT * FROM stores WHERE owner_id = $1',
      [ownerId]
    );
    return result.rows[0];
  }

  static async getStoresCount() {
    const result = await pool.query('SELECT COUNT(*) as count FROM stores');
    return result.rows[0].count;
  }

  static async getStoreRatings(storeId) {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return result.rows;
  }

  static async update(id, updateData, userId = null, userRole = null) {
    const { name, email, address, owner_id } = updateData;
    
    // Get current store data
    const currentStore = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (!currentStore.rows.length) {
      return null;
    }

    // Build dynamic update query based on provided fields
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = $1');
      updateValues.push(name);
    }

    if (email !== undefined) {
      updateFields.push('email = $' + (updateValues.length + 1));
      updateValues.push(email);
    }

    if (address !== undefined) {
      updateFields.push('address = $' + (updateValues.length + 1));
      updateValues.push(address);
    }

    if (owner_id !== undefined) {
      updateFields.push('owner_id = $' + (updateValues.length + 1));
      updateValues.push(owner_id);
    }

    if (updateFields.length === 0) {
      return false; // No fields to update
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    const query = `UPDATE stores SET ${updateFields.join(', ')} WHERE id = $` + (updateValues.length);
    const result = await pool.query(query, updateValues);
    
    return result.rowCount > 0;
  }

  static async checkOwnerExists(ownerId, excludeStoreId = null) {
    let query = 'SELECT id FROM stores WHERE owner_id = $1';
    const params = [ownerId];
    
    if (excludeStoreId) {
      query += ' AND id != $2';
      params.push(excludeStoreId);
    }
    
    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }
}

module.exports = Store;