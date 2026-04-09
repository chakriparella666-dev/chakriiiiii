const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    sizes: { type: String },
    sizeStock: {
      S:  { type: Number, default: 0 },
      M:  { type: Number, default: 0 },
      L:  { type: Number, default: 0 },
      XL: { type: Number, default: 0 }
    },
    colors: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.pre("save", function(next) {
  if (this.sizeStock) {
    this.stock = (this.sizeStock.S || 0) + 
                 (this.sizeStock.M || 0) + 
                 (this.sizeStock.L || 0) + 
                 (this.sizeStock.XL || 0);
  }
  next();
});

productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
