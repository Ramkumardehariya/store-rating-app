const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { name, email, password, address, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, address, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role, now, now]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
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
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      query += ' AND email LIKE ?';
      params.push(`%${filters.email}%`);
    }

    if (filters.address) {
      query += ' AND address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    if (filters.role) {
      query += ' AND role = ?';
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

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getUsersCount() {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    return rows[0].count;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;