const Procurement = require('../models/Procurement');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Get all procurements
exports.getAll = async (req, res) => {
  try {
    const { status, priority, department, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (department) where.department = department;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: '%' + search + '%' } },
        { description: { [Op.like]: '%' + search + '%' } }
      ];
    }

    const procurements = await Procurement.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(procurements);
  } catch (error) {
    console.error('Error fetching procurements:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get procurement by ID
exports.getById = async (req, res) => {
  try {
    const procurement = await Procurement.findByPk(req.params.id);
    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }
    res.json(procurement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create procurement
exports.create = async (req, res) => {
  try {
    const procurement = await Procurement.create({
      ...req.body,
      id: uuidv4(),
      createdBy: req.user.id
    });
    res.status(201).json(procurement);
  } catch (error) {
    console.error('Error creating procurement:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update procurement
exports.update = async (req, res) => {
  try {
    const procurement = await Procurement.findByPk(req.params.id);
    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }

    await procurement.update(req.body);
    res.json(procurement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete procurement
exports.delete = async (req, res) => {
  try {
    const procurement = await Procurement.findByPk(req.params.id);
    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }

    await procurement.destroy();
    res.json({ message: 'Procurement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve procurement
exports.approve = async (req, res) => {
  try {
    const procurement = await Procurement.findByPk(req.params.id);
    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }

    await procurement.update({ status: 'approved' });
    res.json({ message: 'Procurement approved', procurement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject procurement
exports.reject = async (req, res) => {
  try {
    const procurement = await Procurement.findByPk(req.params.id);
    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }

    await procurement.update({ 
      status: 'rejected',
      rejectionReason: req.body.reason 
    });
    res.json({ message: 'Procurement rejected', procurement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get procurement stats
exports.getStats = async (req, res) => {
  try {
    const total = await Procurement.count();
    const pending = await Procurement.count({ where: { status: 'pending' } });
    const approved = await Procurement.count({ where: { status: 'approved' } });
    const rejected = await Procurement.count({ where: { status: 'rejected' } });
    
    const result = await Procurement.findAll({
      attributes: [
        [Procurement.sequelize.fn('SUM', Procurement.sequelize.col('budget')), 'totalBudget'],
        [Procurement.sequelize.fn('SUM', Procurement.sequelize.col('spent')), 'totalSpent']
      ]
    });

    res.json({
      total,
      pending,
      approved,
      rejected,
      totalBudget: parseFloat(result[0]?.dataValues?.totalBudget || 0),
      totalSpent: parseFloat(result[0]?.dataValues?.totalSpent || 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
