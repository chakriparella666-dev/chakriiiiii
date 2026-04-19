require('dotenv').config()

const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const helmet       = require('helmet')
const passport     = require('passport')
const compression  = require('compression')
const connectDB    = require('./config/db')
require('./config/passport')

// Connect to Database
connectDB()

const app = express()

// Allowed origins — Vercel frontend + localhost
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://chakriiiiiiii-56xb.vercel.app',
  'https://chakriiiiii-dcts.vercel.app',
  'https://chakriiiiii-1-xzhc.onrender.com',
].filter(Boolean)

// Middleware
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: (origin, callback) => {
    // Allow if: No origin (Postman), matches allowedOrigins, OR is a Vercel subdomain
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// Routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/user',     require('./routes/userRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders',   require('./routes/orderRoutes'))
app.use('/api/cart',     require('./routes/cartRoutes'))
app.use('/api/logistics', require('./routes/logisticsRoutes'))

// Health check
app.get('/health', (req, res) => res.json({ status: 'MSME API running ✅', timestamp: new Date() }))

// Root route (so browser doesn't show "Cannot GET /")
app.get('/', (req, res) => res.json({ 
  message: '🚀 MSME Platform API', 
  version: '1.0.0',
  health: '/health',
  docs: '/api'
}))

// Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message)
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 MSME Server running on port ${PORT}`))
