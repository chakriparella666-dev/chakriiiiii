const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// GET dashboard stats - Optimized for Millisecond Speed
router.get("/", async (req, res) => {
  try {
    // Parallel counting for speed
    const [totalOrders, totalProducts, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(6).lean()
    ]);

    // Fast Revenue aggregation via MongoDB instead of JS reduce (Massively faster)
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      revenue: revenue.toFixed(2),
      totalOrders,
      totalProducts,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
