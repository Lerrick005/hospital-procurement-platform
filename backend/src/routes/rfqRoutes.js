const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', rfqController.getAll);
router.get('/stats', rfqController.getStats);
router.post('/', rfqController.create);
router.get('/:id', rfqController.getById);
router.put('/:id', rfqController.update);
router.delete('/:id', rfqController.delete);
router.post('/:id/submit', rfqController.submit);
router.post('/:id/approve', rfqController.approve);
router.post('/:id/reject', rfqController.reject);

module.exports = router;
