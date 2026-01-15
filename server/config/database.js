const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'store_rating_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    // Create stores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INT,
        created_at DATETIME,
        updated_at DATETIME,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create ratings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL,
        created_at DATETIME,
        updated_at DATETIME,
        UNIQUE unique_user_store (user_id, store_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      )
    `);

    // Create default admin user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    await connection.execute(
      'INSERT IGNORE INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      ['System Administrator', 'admin@store.com', hashedPassword, 'System Address', 'admin']
    );

    connection.release();
    console.log('Database initialized successfully');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

module.exports = { pool, initializeDatabase };