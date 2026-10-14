const Supplier = require('../models/Supplier');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const { category, status, rating, search } = req.query;
    const where = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (rating) where.rating = { [Op.gte]: rating };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: '%' + search + '%' } },
        { email: { [Op.like]: '%' + search + '%' } },
        { category: { [Op.like]: '%' + search + '%' } }
      ];
    }

    const suppliers = await Supplier.findAll({
      where,
      order: [['rating', 'DESC']]
    });

    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      id: uuidv4()
    });
    res.status(201).json(supplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Supplier.count();
    const active = await Supplier.count({ where: { status: 'active' } });
    const pending = await Supplier.count({ where: { status: 'pending' } });

    const result = await Supplier.findAll({
      attributes: [
        [Supplier.sequelize.fn('AVG', Supplier.sequelize.col('rating')), 'avgRating'],
        [Supplier.sequelize.fn('SUM', Supplier.sequelize.col('totalSpend')), 'totalSpend']
      ]
    });

    res.json({
      total,
      active,
      pending,
      averageRating: parseFloat(result[0]?.dataValues?.avgRating || 0),
      totalSpend: parseFloat(result[0]?.dataValues?.totalSpend || 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
