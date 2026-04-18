const passport      = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User          = require('../models/User')
require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER

const CALLBACK_URL = isProd 
  ? 'https://chakriiiiii-1-xzhc.onrender.com/api/auth/google/callback'
  : (process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback')

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id })
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value })
      if (user) {
        user.googleId = profile.id
        user.avatar   = profile.photos[0]?.value
        await user.save()
      } else {
        user = await User.create({
          name:     profile.displayName,
          email:    profile.emails[0].value,
          googleId: profile.id,
          avatar:   profile.photos[0]?.value,
          isVerified: true,
        })
      }
    }
    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))
