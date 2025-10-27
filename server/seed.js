const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

// Connect to MongoDB
connectDB();

const products = [
   // I'm including 25 sample products here - paste the full 500 from the txt file I created
   { name: "Classic White Dress Shirt", price: 49.99, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600", rating: 4.5, countInStock: 50, description: "A timeless white dress shirt perfect for any formal occasion." },
   { name: "Slim Fit Black Jeans", price: 79.99, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600", rating: 4.7, countInStock: 45, description: "Modern slim fit jeans in classic black." },
   { name: "Navy Blue Blazer", price: 159.99, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600", rating: 4.8, countInStock: 30, description: "Elegant navy blazer for professional look." },
   { name: "Little Black Dress", price: 89.99, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", rating: 4.8, countInStock: 40, description: "The essential LBD every wardrobe needs." },
   { name: "High-Waisted Jeans", price: 74.99, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600", rating: 4.7, countInStock: 55, description: "Flattering high-waisted denim jeans." },
   { name: "White Sneakers", price: 79.99, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", rating: 4.6, countInStock: 60, description: "Classic white sneakers for everyday wear." },
   { name: "Black Leather Boots", price: 149.99, category: "Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600", rating: 4.8, countInStock: 35, description: "Premium leather boots for any season." },
   { name: "Leather Handbag", price: 129.99, category: "Accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", rating: 4.7, countInStock: 40, description: "Stylish leather handbag with ample storage." },
   { name: "Designer Sunglasses", price: 189.99, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600", rating: 4.8, countInStock: 50, description: "Trendy designer sunglasses with UV protection." },
   { name: "Leather Jacket", price: 249.99, category: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", rating: 4.9, countInStock: 25, description: "Premium leather jacket with timeless style." },
   { name: "Wool Coat", price: 199.99, category: "Outerwear", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600", rating: 4.8, countInStock: 30, description: "Warm wool coat for winter season." },
   { name: "Cotton Polo Shirt", price: 34.99, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600", rating: 4.3, countInStock: 60, description: "Comfortable cotton polo for casual wear." },
   { name: "Khaki Chinos", price: 64.99, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600", rating: 4.6, countInStock: 55, description: "Versatile khaki chinos for any occasion." },
   { name: "Floral Maxi Dress", price: 79.99, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600", rating: 4.6, countInStock: 45, description: "Beautiful floral print maxi dress." },
   { name: "Silk Blouse", price: 64.99, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=600", rating: 4.5, countInStock: 50, description: "Elegant silk blouse for professional wear." },
   { name: "Running Shoes", price: 119.99, category: "Footwear", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600", rating: 4.7, countInStock: 50, description: "High-performance running shoes." },
   { name: "High Heels", price: 89.99, category: "Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600", rating: 4.5, countInStock: 40, description: "Elegant high heels for special occasions." },
   { name: "Canvas Backpack", price: 79.99, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", rating: 4.6, countInStock: 55, description: "Durable canvas backpack for daily use." },
   { name: "Wool Hat", price: 34.99, category: "Accessories", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600", rating: 4.3, countInStock: 65, description: "Cozy wool hat for cold weather." },
   { name: "Puffer Jacket", price: 129.99, category: "Outerwear", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", rating: 4.7, countInStock: 40, description: "Warm puffer jacket for winter." },
   { name: "Trench Coat", price: 179.99, category: "Outerwear", image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600", rating: 4.8, countInStock: 25, description: "Classic trench coat in beige." },
   { name: "Graphic T-Shirt", price: 24.99, category: "Men's Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", rating: 4.2, countInStock: 100, description: "Trendy graphic tee with cool design." },
   { name: "Pencil Skirt", price: 49.99, category: "Women's Clothing", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600", rating: 4.4, countInStock: 60, description: "Professional pencil skirt for office wear." },
   { name: "Loafers", price: 74.99, category: "Footwear", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600", rating: 4.4, countInStock: 45, description: "Comfortable leather loafers." },
   { name: "Leather Belt", price: 39.99, category: "Accessories", image: "https://images.unsplash.com/photo-1624222247344-550fb60583aa?w=600", rating: 4.4, countInStock: 70, description: "Classic leather belt in brown." }
];

const importData = async () => {
   try {
      await Product.deleteMany();
      await Product.insertMany(products);

      console.log('✅ Data Imported Successfully!');
      process.exit();
   } catch (error) {
      console.error('❌ Error importing data:', error);
      process.exit(1);
   }
};

const destroyData = async () => {
   try {
      await Product.deleteMany();
      await User.deleteMany();

      console.log('✅ Data Destroyed Successfully!');
      process.exit();
   } catch (error) {
      console.error('❌ Error destroying data:', error);
      process.exit(1);
   }
};

if (process.argv[2] === '-d') {
   destroyData();
} else {
   importData();
}
