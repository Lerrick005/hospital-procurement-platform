const { Sequelize } = require('sequelize');
require('dotenv').config();

// Force the correct database name
const sequelize = new Sequelize(
  'healthprocure',  // Hardcode the database name
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection and sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync models (will create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
})();

module.exports = sequelize;
