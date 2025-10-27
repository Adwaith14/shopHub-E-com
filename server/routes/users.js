const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

router.post('/address', protect, async (req, res) => {
   try {
      const { fullName, addressLine, city, state, pincode, country, phone } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.shippingAddresses.push({
         fullName: fullName || '',
         addressLine: addressLine || '',
         city: city || '',
         state: state || '',
         pincode: pincode || '',
         country: country || '',
         phone: phone || ''
      });

      await user.save();
      res.json({ success: true, message: 'Address saved successfully' });
   } catch (error) {
      console.error('Save address error:', error);
      res.status(500).json({ success: false, message: 'Error saving address' });
   }
});

router.get('/addresses', protect, async (req, res) => {
   try {
      const user = await User.findById(req.user._id);
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, addresses: user.shippingAddresses || [] });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching addresses' });
   }
});

router.get('/profile', protect, async (req, res) => {
   try {
      res.json({ success: true, user: req.user });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
   }
});

module.exports = router;
