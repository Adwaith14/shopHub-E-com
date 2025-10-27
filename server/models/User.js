const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddressSchema = new mongoose.Schema({
   fullName: String,
   addressLine: String,
   city: String,
   state: String,
   pincode: String,
   country: String,
   phone: String
});

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
   },
   email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
   },
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
   },
   role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
   },
   shippingAddresses: [AddressSchema],
   createdAt: {
      type: Date,
      default: Date.now
   }
});

UserSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
