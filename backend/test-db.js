const { Sequelize } = require('sequelize');

// Hardcoded connection
const sequelize = new Sequelize('healthprocure', 'postgres', 'admin123', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log
});

async function test() {
  try {
    console.log('🔍 Connecting to healthprocure...');
    await sequelize.authenticate();
    console.log('✅ SUCCESS! Connected to healthprocure!');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

test();
