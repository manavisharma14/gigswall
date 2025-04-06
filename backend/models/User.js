const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String},               // ✅ New field
  email: { type: String, required: true, unique: true },
  password: { type: String},
  department: { type: String }      ,        
  googleId: { type: String }, // Google users only
  // ✅ New field
  // In models/User.js
gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' }

});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
