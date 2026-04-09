const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    email:    { type: String },
    phone:    { type: String },
    address:  { type: String, required: true },
    items:    [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name:      { type: String },
        price:     { type: Number },
        quantity:  { type: Number }
      }
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
