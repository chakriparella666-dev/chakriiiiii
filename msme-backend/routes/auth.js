const express  = require('express')
const passport = require('passport')
const router   = express.Router()
const { register, login, googleCallback, getMe, logout, forgotPassword, resetPassword, updateProfile } = require('../controllers/authController')
const { verifyToken } = require('../middleware/authMiddleware')

// Trigger reload
router.get('/ping', (req, res) => res.json({ msg: 'auth api online' }))

router.post('/register',  register)
router.post('/login',     login)
router.get('/me',         verifyToken, getMe)
router.put('/update-profile', verifyToken, (req, res, next) => {
  console.log('📡 PUT /api/auth/update-profile hit!');
  next();
}, updateProfile)
router.post('/logout',    verifyToken, logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/google', (req, res, next) => {
  const host = req.get('host');
  // Use x-forwarded-proto for Render/Vercel (HTTPS)
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const callbackURL = `${protocol}://${host}/api/auth/google/callback`;
  
  passport.authenticate('google', { 
    scope: ['profile','email'], 
    session: false,
    callbackURL: callbackURL
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  const host = req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const callbackURL = `${protocol}://${host}/api/auth/google/callback`;

  passport.authenticate('google', { 
    session: false, 
    callbackURL: callbackURL,
    failureRedirect: `${process.env.CLIENT_URL || 'https://chakriiiiii-e9j3.vercel.app'}/login?error=google_failed` 
  })(req, res, next);
}, googleCallback);

module.exports = router
