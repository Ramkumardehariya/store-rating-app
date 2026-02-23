const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { name, email, password, address, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, email, hashedPassword, address, role, now, now]
    );
    
    return result.rows[0].id;
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, id]
    );
  }

  static async getAllUsers(filters = {}) {
    let query = `
      SELECT id, name, email, address, role, created_at 
      FROM users 
      WHERE 1=1
    `;
    const params = [];

    if (filters.name) {
      query += ' AND name LIKE $' + (params.length + 1);
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      query += ' AND email LIKE $' + (params.length + 1);
      params.push(`%${filters.email}%`);
    }

    if (filters.address) {
      query += ' AND address LIKE $' + (params.length + 1);
      params.push(`%${filters.address}%`);
    }

    if (filters.role) {
      query += ' AND role = $' + (params.length + 1);
      params.push(filters.role);
    }

    // Add sorting
    if (filters.sortBy) {
      const validColumns = ['name', 'email', 'address', 'role', 'created_at'];
      if (validColumns.includes(filters.sortBy)) {
        query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
      }
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // Add pagination
    if (filters.limit) {
      query += ' LIMIT $' + (params.length + 1);
      params.push(parseInt(filters.limit));
    }

    if (filters.offset) {
      query += ' OFFSET $' + (params.length + 1);
      params.push(parseInt(filters.offset));
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getUsersCount() {
    const result = await pool.query('SELECT COUNT(*) as count FROM users');
    return result.rows[0].count;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;