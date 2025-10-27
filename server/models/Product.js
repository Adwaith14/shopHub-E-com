const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
   },
   description: {
      type: String,
      required: [true, 'Please provide product description']
   },
   price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0
   },
   category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['Audio', 'Wearables', 'Fashion', 'Footwear', 'Home']
   },
   image: {
      type: String,
      required: [true, 'Please provide product image URL']
   },
   stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
   },
   rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
   },
   reviews: {
      type: Number,
      default: 0
   },
   featured: {
      type: Boolean,
      default: false
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model('Product', ProductSchema);
