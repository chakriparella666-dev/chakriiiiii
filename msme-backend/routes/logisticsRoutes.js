const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createShipment, getTrackingInfo } = require('../controllers/logisticsController');

router.post('/shipment', protect, createShipment);
router.get('/track/:awb', protect, getTrackingInfo);

module.exports = router;
