const mongoose = require('mongoose')

const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      })
      console.log('✅ MongoDB connected')
      return
    } catch (err) {
      console.error(`❌ MongoDB attempt ${i + 1} failed: ${err.message}`)
      if (i < retries - 1) await new Promise(r => setTimeout(r, 2000))
      else { console.error('❌ MongoDB connection failed after 3 attempts'); process.exit(1) }
    }
  }
}

module.exports = connectDB
