const mongoose = require("mongoose");
require("dotenv").config();

async function checkSizes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const stats = await db.collection("products").stats();
    console.log("Collection Stats:", stats.avgObjSize, "bytes average");
    
    const sample = await db.collection("products").findOne();
    if (sample && sample.images) {
      console.log("Image count:", sample.images.length);
      console.log("First image size:", sample.images[0].length, "chars");
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkSizes();
