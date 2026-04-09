const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

async function masterStockAudit() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Audit");
    
    const products = await Product.find();
    console.log(`Auditing ${products.length} products...`);

    for (let p of products) {
      if (!p.sizeStock) p.sizeStock = { S: 0, M: 0, L: 0, XL: 0 };
      
      const sum = (p.sizeStock.S || 0) + (p.sizeStock.M || 0) + (p.sizeStock.L || 0) + (p.sizeStock.XL || 0);
      
      if (sum !== p.stock) {
        console.log(`- Fix ${p.name}: Total ${p.stock} vs Sum ${sum}. adjusting 'M'...`);
        // Force the difference into 'M' to keep it fast
        p.sizeStock.M = Math.max(0, p.stock - (p.sizeStock.S + p.sizeStock.L + p.sizeStock.XL));
        
        // Final sanity check: if sum is still not matching, force total stock to match sum
        const finalSum = p.sizeStock.S + p.sizeStock.M + p.sizeStock.L + p.sizeStock.XL;
        p.stock = finalSum;
        
        await Product.findByIdAndUpdate(p._id, { sizeStock: p.sizeStock, stock: p.stock });
        console.log(`  Done: M is now ${p.sizeStock.M}, Total is ${p.stock}`);
      }
    }

    console.log("Audit complete!");
    process.exit(0);
  } catch (err) {
    console.error("Audit failed:", err);
    process.exit(1);
  }
}

masterStockAudit();
