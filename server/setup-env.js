#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create .env file from .env.example if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from .env.example');
    console.log('⚠️  Please update the .env file with your database credentials:');
    console.log('   - DB_PASSWORD: Your MySQL password');
    console.log('   - JWT_SECRET: Generate a secure secret key');
    console.log('   - Other values as needed for your setup');
  } else {
    // Create basic .env file if .env.example doesn't exist
    const basicEnv = `# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=store_rating_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration (optional)
CLIENT_URL=http://localhost:5173
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Basic .env file created');
    console.log('⚠️  Please update the .env file with your database credentials');
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if MySQL is running (basic check)
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    console.log('✅ Database connection successful');
    await connection.end();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('💡 Please ensure:');
    console.log('   1. MySQL is installed and running');
    console.log('   2. Database credentials in .env are correct');
    console.log('   3. Database "store_rating_db" exists (or create it)');
  }
}

checkDatabase();
