const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get orders for a seller
// @route   GET /api/orders/seller
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
  try {
    // Find orders containing products from this seller
    const orders = await Order.find({ 'products.seller': req.user.id })
      .populate('buyer', 'name email avatar')
      .populate('products.product', 'name images category');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify if seller owns any product in this order (optional security)
    const isSeller = order.products.some(p => p.seller.toString() === req.user.id.toString());
    if (!isSeller) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get seller stats
// @route   GET /api/orders/seller/stats
// @access  Private/Seller
exports.getSellerStats = async (req, res) => {
  try {
    const orders = await Order.find({ 'products.seller': req.user.id, status: 'Delivered' });
    
    const totalSales = orders.reduce((acc, order) => {
      const sellerProducts = order.products.filter(p => p.seller.toString() === req.user.id.toString());
      const sellerTotal = sellerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      return acc + sellerTotal;
    }, 0);

    const activeOrders = await Order.countDocuments({ 
      'products.seller': req.user.id, 
      status: { $in: ['Ordered', 'Dispatched', 'Shipped'] } 
    });

    // Calculate daily revenue for the current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Start of month (local time)
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    // End of month (local time)
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const currentMonthOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= startOfMonth && orderDate <= endOfMonth;
    });
    
    const dailyData = {};
    const daysInMonth = endOfMonth.getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      dailyData[d] = 0;
    }

    currentMonthOrders.forEach(order => {
      const day = new Date(order.createdAt).getDate();
      const sellerProducts = order.products.filter(p => p.seller.toString() === req.user.id.toString());
      const sellerTotal = sellerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      dailyData[day] += sellerTotal;
    });

    const dailyRevenue = Object.keys(dailyData).sort((a,b) => a-b).map(day => ({
      day: parseInt(day),
      revenue: dailyData[day]
    }));

    console.log(`[Stats] Month: ${currentMonth + 1}, Year: ${currentYear}, Orders found: ${currentMonthOrders.length}`);

    res.status(200).json({ 
      success: true, 
      data: { 
        totalSales, 
        activeOrders,
        dailyRevenue,
        month: now.toLocaleString('default', { month: 'long' }),
        year: currentYear
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get buyer's own orders
// @route   GET /api/orders/my-orders
// @access  Private/Buyer
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('products.product', 'name images price')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
