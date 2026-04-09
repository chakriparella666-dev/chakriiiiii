const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

async function syncStockData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const products = await Product.find({ 
      $or: [
        { sizeStock: { $exists: false } },
        { "sizeStock.S": { $exists: false } }
      ] 
    });

    console.log(`Found ${products.length} products to update...`);

    for (let p of products) {
      // If product has total stock but no size stock, give it to 'M' by default
      const stock = p.stock || 0;
      p.sizeStock = {
        S: 0,
        M: stock,
        L: 0,
        XL: 0
      };
      await p.save();
      console.log(`- Updated ${p.name}: Total ${stock} -> M: ${stock}`);
    }

    console.log("Sync complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error syncing stock:", err);
    process.exit(1);
  }
}

syncStockData();
