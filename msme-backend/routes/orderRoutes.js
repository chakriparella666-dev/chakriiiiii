const express = require('express');
const router = express.Router();
const { 
  getSellerOrders, 
  updateOrderStatus, 
  getSellerStats,
  getMyOrders,
} = require('../controllers/orderController');
const { placeOrder } = require('../controllers/checkoutController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/my-orders', verifyToken, getMyOrders);
router.get('/seller', verifyToken, getSellerOrders);
router.get('/seller/stats', verifyToken, getSellerStats);
router.put('/:id/status', verifyToken, updateOrderStatus);
router.post('/checkout', verifyToken, placeOrder);

module.exports = router;

