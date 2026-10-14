const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'viewer'
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'Users'
});

// Instance method to check password
User.prototype.validatePassword = async function(password) {
  try {
    console.log('🔍 Comparing passwords...');
    console.log('📝 Input password:', password);
    console.log('🔑 Stored hash:', this.password);
    const result = await bcrypt.compare(password, this.password);
    console.log('✅ Comparison result:', result);
    return result;
  } catch (error) {
    console.error('❌ Password validation error:', error);
    return false;
  }
};

module.exports = User;
