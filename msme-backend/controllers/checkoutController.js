const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const orderProducts = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size,
      price: item.product.price,
      seller: item.product.seller
    }));

    const totalAmount = orderProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    const order = await Order.create({
      buyer: req.user.id,
      products: orderProducts,
      shippingAddress,
      totalAmount,
      status: 'Ordered',
      paymentStatus: 'Completed' // Mock payment
    });

    // Reduce stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      if (sizeIndex > -1) {
        product.sizes[sizeIndex].stock -= item.quantity;
        await product.save();
      }
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
