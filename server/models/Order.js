const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
   },
   orderItems: [{
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true }
   }],
   shippingAddress: {
      fullName: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }
   },
   paymentMethod: {
      type: String,
      required: true,
      default: 'upi'
   },
   totalPrice: {
      type: Number,
      required: true,
      default: 0.0
   },
   isPaid: {
      type: Boolean,
      default: false
   },
   isDelivered: {
      type: Boolean,
      default: false
   }
}, {
   timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);