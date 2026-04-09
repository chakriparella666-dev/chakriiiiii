const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  sizeStock: {
    S: Number, M: Number, L: Number, XL: Number
  },
  stock: Number
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function fixInventory() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find();
  
  for (const p of products) {
    const total = (p.sizeStock?.S || 0) + (p.sizeStock?.M || 0) + (p.sizeStock?.L || 0) + (p.sizeStock?.XL || 0);
    if (total > 0 || p.stock !== total) {
      console.log(`Fixing ${p.name || p._id}: ${p.stock} -> ${total}`);
      // If total was 0 but stock was 6, maybe they want the stock distributed?
      // But the user says "showing error", so I'll just sync them.
      p.stock = total;
      await p.save();
    }
  }
  console.log('✅ Inventory audit complete');
  process.exit(0);
}

fixInventory();
