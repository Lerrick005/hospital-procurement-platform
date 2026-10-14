const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Routes
router.get('/', procurementController.getAll);
router.get('/stats', procurementController.getStats);
router.get('/:id', procurementController.getById);
router.post('/', procurementController.create);
router.put('/:id', procurementController.update);
router.delete('/:id', procurementController.delete);
router.post('/:id/approve', procurementController.approve);
router.post('/:id/reject', procurementController.reject);

module.exports = router;
