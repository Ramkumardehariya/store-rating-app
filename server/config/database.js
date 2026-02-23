const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initializeDatabase = async () => {
  try {
    const client = await pool.connect();

    // USERS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // STORES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // RATINGS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        store_id INT REFERENCES stores(id) ON DELETE CASCADE,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `);

    // DEFAULT ADMIN USER
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await client.query(`
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (email) DO NOTHING
    `, [
      'System Administrator',
      'admin@store.com',
      hashedPassword,
      'System Address',
      'admin'
    ]);

    client.release();
    console.log('Database initialized successfully (Supabase PostgreSQL)');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

module.exports = { pool, initializeDatabase }; 
