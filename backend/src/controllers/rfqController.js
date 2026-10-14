const RFQ = require('../models/RFQ');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Generate RFQ number
const generateRFQNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random()  * 10000).toString().padStart(4, '0');
  return `RFQ-${year}-${random}`;
};

exports.getAll = async (req, res) => {
  try {
    const { search, status, priority, department } = req.query;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (department) where.department = department;

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: '%' + search + '%' } },
        { rfqNumber: { [Op.like]: '%' + search + '%' } },
        { department: { [Op.like]: '%' + search + '%' } }
      ];
    }

    const rfqs = await RFQ.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(rfqs);
  } catch (error) {
    console.error('Error fetching RFQs:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const rfq = await RFQ.create({
      ...req.body,
      id: uuidv4(),
      rfqNumber: generateRFQNumber(),
      status: 'draft'
    });
    res.status(201).json(rfq);
  } catch (error) {
    console.error('Error creating RFQ:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    await rfq.update(req.body);
    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    await rfq.destroy();
    res.json({ message: 'RFQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await RFQ.count();
    const draft = await RFQ.count({ where: { status: 'draft' } });
    const pending = await RFQ.count({ where: { status: 'pending' } });
    const approved = await RFQ.count({ where: { status: 'approved' } });
    const rejected = await RFQ.count({ where: { status: 'rejected' } });
    const completed = await RFQ.count({ where: { status: 'completed' } });

    res.json({
      total,
      draft,
      pending,
      approved,
      rejected,
      completed
    });
  } catch (error) {
    console.error('Error getting RFQ stats:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.submit = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    if (rfq.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft RFQs can be submitted' });
    }
    await rfq.update({ status: 'pending' });
    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    if (rfq.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending RFQs can be approved' });
    }
    await rfq.update({ 
      status: 'approved',
      approvedBy: req.user?.id || null,
      approvedByName: req.user?.name || null,
      approvedAt: new Date()
    });
    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reject = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    if (rfq.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending RFQs can be rejected' });
    }
    await rfq.update({ 
      status: 'rejected',
      notes: req.body.reason ? `${rfq.notes || ''}\nRejection reason: ${req.body.reason}`.trim() : rfq.notes
    });
    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
