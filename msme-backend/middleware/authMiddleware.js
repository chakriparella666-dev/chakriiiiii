const jwt  = require('jsonwebtoken')
const User = require('../models/User')

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' })
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
}
