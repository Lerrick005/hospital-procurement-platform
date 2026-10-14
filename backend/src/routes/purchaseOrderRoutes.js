const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');
const { auth } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Public routes (no specific ID)
router.get('/', purchaseOrderController.getAll);
router.get('/stats', purchaseOrderController.getStats);
router.post('/', purchaseOrderController.create);

// ID-specific routes
router.get('/:id', purchaseOrderController.getById);
router.put('/:id', purchaseOrderController.update);
router.delete('/:id', purchaseOrderController.delete);

// Action routes
router.post('/:id/approve', purchaseOrderController.approve);
router.post('/:id/reject', purchaseOrderController.reject);
router.post('/:id/submit', purchaseOrderController.submit);
router.post('/:id/complete', purchaseOrderController.complete);

module.exports = router;
