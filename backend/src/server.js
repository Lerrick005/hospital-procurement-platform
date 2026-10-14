require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const sequelize = require('./config/database');

require('./models/User');
require('./models/Supplier');
require('./models/PurchaseOrder');
require('./models/Procurement');

const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const poRoutes = require('./routes/poRoutes');
const procurementRoutes = require('./routes/procurementRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/pos', poRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/suppliers', supplierRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HealthProcure API is running!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log('🚀 Server running on http://localhost:' + PORT);
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    console.log('✅ Routes: /api/auth, /api/suppliers, /api/pos, /api/procurement');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
});
