const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
   try {
      const products = await Product.find({});

      res.json({
         success: true,
         count: products.length,
         products
      });
   } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching products'
      });
   }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);

      if (!product) {
         return res.status(404).json({
            success: false,
            message: 'Product not found'
         });
      }

      res.json({
         success: true,
         product
      });
   } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching product'
      });
   }
});

// @route   POST /api/products
// @desc    Create product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
   try {
      const product = await Product.create(req.body);

      res.status(201).json({
         success: true,
         product
      });
   } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
         success: false,
         message: 'Error creating product'
      });
   }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
   try {
      const product = await Product.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true, runValidators: true }
      );

      if (!product) {
         return res.status(404).json({
            success: false,
            message: 'Product not found'
         });
      }

      res.json({
         success: true,
         product
      });
   } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
         success: false,
         message: 'Error updating product'
      });
   }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
   try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
         return res.status(404).json({
            success: false,
            message: 'Product not found'
         });
      }

      res.json({
         success: true,
         message: 'Product deleted successfully'
      });
   } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
         success: false,
         message: 'Error deleting product'
      });
   }
});

module.exports = router;
