const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
   try {
      const adminExists = await User.findOne({ email: 'admin@shophub.com' });

      if (adminExists) {
         console.log('❌ Admin already exists');
         process.exit();
      }

      const admin = await User.create({
         name: 'Admin',
         email: 'admin@shophub.com',
         password: 'Admin@1234',
         role: 'admin'
      });

      console.log('✅ Admin created successfully!');
      console.log('📧 Email: admin@shophub.com');
      console.log('🔑 Password: Admin@1234');
      process.exit();
   } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
   }
};

createAdmin();
