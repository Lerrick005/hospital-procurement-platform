const PurchaseOrder = require('../models/PurchaseOrder');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Generate PO number
const generatePONumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PO-${year}-${random}`;
};

exports.getAll = async (req, res) => {
  try {
    const { search, status, priority, department, supplierId, dateFrom, dateTo } = req.query;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (department) where.department = department;
    if (supplierId) where.supplierId = supplierId;

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: '%' + search + '%' } },
        { poNumber: { [Op.like]: '%' + search + '%' } },
        { supplierName: { [Op.like]: '%' + search + '%' } },
        { department: { [Op.like]: '%' + search + '%' } }
      ];
    }

    if (dateFrom && dateTo) {
      where.createdAt = {
        [Op.between]: [new Date(dateFrom), new Date(dateTo)]
      };
    }

    const purchaseOrders = await PurchaseOrder.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(purchaseOrders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { items = [], totalAmount = 0, ...data } = req.body;
    
    const purchaseOrder = await PurchaseOrder.create({
      ...data,
      id: uuidv4(),
      poNumber: generatePONumber(),
      items,
      totalAmount: totalAmount || items.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
      status: 'draft'
    });

    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    const { items, totalAmount, ...data } = req.body;
    
    if (items) {
      data.items = items;
      data.totalAmount = totalAmount || items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    }

    await purchaseOrder.update(data);
    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    // Only allow deletion of draft or rejected orders
    if (purchaseOrder.status !== 'draft' && purchaseOrder.status !== 'rejected') {
      return res.status(400).json({ 
        message: 'Cannot delete a purchase order that is not in draft or rejected status' 
      });
    }

    await purchaseOrder.destroy();
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await PurchaseOrder.count();
    const pending = await PurchaseOrder.count({ where: { status: 'pending' } });
    const approved = await PurchaseOrder.count({ where: { status: 'approved' } });
    const rejected = await PurchaseOrder.count({ where: { status: 'rejected' } });
    const completed = await PurchaseOrder.count({ where: { status: 'completed' } });
    const draft = await PurchaseOrder.count({ where: { status: 'draft' } });

    const result = await PurchaseOrder.findAll({
      attributes: [
        [PurchaseOrder.sequelize.fn('SUM', PurchaseOrder.sequelize.col('totalAmount')), 'totalValue']
      ]
    });

    const pendingResult = await PurchaseOrder.findAll({
      where: { status: 'pending' },
      attributes: [
        [PurchaseOrder.sequelize.fn('SUM', PurchaseOrder.sequelize.col('totalAmount')), 'pendingValue']
      ]
    });

    const approvedResult = await PurchaseOrder.findAll({
      where: { status: 'approved' },
      attributes: [
        [PurchaseOrder.sequelize.fn('SUM', PurchaseOrder.sequelize.col('totalAmount')), 'approvedValue']
      ]
    });

    res.json({
      total,
      pending,
      approved,
      rejected,
      completed,
      draft,
      totalValue: parseFloat(result[0]?.dataValues?.totalValue || 0),
      pendingValue: parseFloat(pendingResult[0]?.dataValues?.pendingValue || 0),
      approvedValue: parseFloat(approvedResult[0]?.dataValues?.approvedValue || 0)
    });
  } catch (error) {
    console.error('Error getting purchase order stats:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const { notes } = req.body;
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    if (purchaseOrder.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending purchase orders can be approved' 
      });
    }

    await purchaseOrder.update({
      status: 'approved',
      approvedBy: req.user?.id || null,
      approvedByName: req.user?.name || null,
      approvedAt: new Date(),
      notes: notes ? `${purchaseOrder.notes || ''}\nApproval notes: ${notes}`.trim() : purchaseOrder.notes
    });

    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reject = async (req, res) => {
  try {
    const { reason } = req.body;
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    if (purchaseOrder.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending purchase orders can be rejected' 
      });
    }

    await purchaseOrder.update({
      status: 'rejected',
      notes: reason ? `${purchaseOrder.notes || ''}\nRejection reason: ${reason}`.trim() : purchaseOrder.notes
    });

    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submit = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    if (purchaseOrder.status !== 'draft') {
      return res.status(400).json({ 
        message: 'Only draft purchase orders can be submitted for approval' 
      });
    }

    await purchaseOrder.update({
      status: 'pending'
    });

    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.complete = async (req, res) => {
  try {
    const { deliveryDate } = req.body;
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
    
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    if (purchaseOrder.status !== 'approved') {
      return res.status(400).json({ 
        message: 'Only approved purchase orders can be completed' 
      });
    }

    await purchaseOrder.update({
      status: 'completed',
      deliveryDate: deliveryDate || new Date()
    });

    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
