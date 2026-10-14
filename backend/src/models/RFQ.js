const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RFQ = sequelize.define('RFQ', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rfqNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  // RFQ-specific fields
  invitedSuppliers: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  receivedQuotes: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  awardedSupplierId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  awardedSupplierName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  awardedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'draft'
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium'
  },
  submissionDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  budgetEstimate: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requestedBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  requestedByName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  approvedByName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  awardedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'RFQs'
});

module.exports = RFQ;
