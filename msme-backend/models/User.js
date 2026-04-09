const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, index: true },
  password:   { type: String, select: false },
  googleId:   { type: String, index: true },
  avatar:     { type: String },
  businessName: { type: String, trim: true },
  role:       { type: String, enum: ['seller','buyer','admin','msme_owner'], default: 'buyer' },
  isVerified: { type: Boolean, default: false },
  lastLogin:  { type: Date },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model('User', UserSchema)
