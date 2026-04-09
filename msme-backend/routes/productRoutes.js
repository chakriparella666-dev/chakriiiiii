const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products - Optimized for Rocket-Fast Discovery
router.get("/", async (req, res) => {
  try {
    // Return only light metadata + 1 image for instant discovery
    const products = await Product.find({}, { 
      images: { $slice: 1 }, 
      description: 0,
      sizeStock: 1 // Keep sizeStock for inventory check
    })
    .sort({ createdAt: -1 })
    .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product - Full details
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    // Enforce stock sync
    if (data.sizeStock) {
      data.stock = Object.values(data.sizeStock).reduce((a, b) => (parseInt(a) || 0) + (parseInt(b) || 0), 0);
    }
    const product = new Product(data);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const data = req.body;
    // Enforce stock sync
    if (data.sizeStock) {
      data.stock = Object.values(data.sizeStock).reduce((a, b) => (parseInt(a) || 0) + (parseInt(b) || 0), 0);
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
