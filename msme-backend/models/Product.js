const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  images: [{
    type: String,
    required: [true, 'Please add at least one image URL']
  }],
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  sizes: [{
    size: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  totalStock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total stock before saving
ProductSchema.pre('save', function(next) {
  this.totalStock = this.sizes.reduce((acc, curr) => acc + curr.stock, 0);
  next();
});

// Indices for search and performance
ProductSchema.index({ name: 'text', category: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema, 'products');
