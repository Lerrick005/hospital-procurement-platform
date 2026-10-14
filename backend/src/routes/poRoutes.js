const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');

// No authentication for testing
router.get('/', purchaseOrderController.getAll);
router.get('/stats', purchaseOrderController.getStats);
router.post('/', purchaseOrderController.create);
router.get('/:id', purchaseOrderController.getById);
router.put('/:id', purchaseOrderController.update);
router.delete('/:id', purchaseOrderController.delete);
router.post('/:id/approve', purchaseOrderController.approve);
router.post('/:id/reject', purchaseOrderController.reject);
router.post('/:id/submit', purchaseOrderController.submit);
router.post('/:id/complete', purchaseOrderController.complete);

module.exports = router;
