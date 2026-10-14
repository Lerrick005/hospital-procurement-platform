const PurchaseOrder = require('../models/PurchaseOrder');

// Generate PO Number
const generatePONumber = () => {
  const date = new Date();
  const prefix = 'PO';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return prefix + '-' + year + month + day + '-' + random;
};

// Create Purchase Order
exports.createPO = async (req, res) => {
  try {
    const poNumber = generatePONumber();
    const po = await PurchaseOrder.create({
      ...req.body,
      poNumber,
      createdBy: req.user.id
    });
    res.status(201).json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all POs
exports.getAllPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(pos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get PO by ID
exports.getPOById = async (req, res) => {
  try {
    const po = await PurchaseOrder.findByPk(req.params.id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }
    res.json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve PO
exports.approvePO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findByPk(req.params.id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }
    await po.update({
      status: 'approved',
      approvedBy: req.user.id
    });
    res.json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update PO Status
exports.updatePOStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const po = await PurchaseOrder.findByPk(req.params.id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }
    await po.update({ status });
    res.json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
