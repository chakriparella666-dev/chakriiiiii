const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const helmet       = require('helmet')
const passport     = require('passport')
const compression  = require('compression')
const connectDB    = require('./config/db')
require('dotenv').config()
require('./config/passport')

// Connect to Database
connectDB()

const app = express()

// Rocket-Fast performance middle-wares
app.use(compression()) // Compresses all responses
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ 
  origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"], 
  credentials: true 
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/stats', require('./routes/statsRoutes'))

app.get('/health', (req, res) => res.json({ status: 'MSME API running ✅' }))

// Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Rocket Server running on port ${PORT}`))
