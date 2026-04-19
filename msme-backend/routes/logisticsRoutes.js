const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createShipment, getTrackingInfo } = require('../controllers/logisticsController');

router.post('/shipment', verifyToken, createShipment);
router.get('/track/:awb', verifyToken, getTrackingInfo);

module.exports = router;
