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

// Allowed origins — add your Vercel + Render URLs here
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://chakriiiiii.vercel.app',
].filter(Boolean)

// Rocket-Fast performance middle-wares
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
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

app.get('/health', (req, res) => res.json({ status: 'MSME API running ✅' }))

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 MSME Server running on port ${PORT}`))
