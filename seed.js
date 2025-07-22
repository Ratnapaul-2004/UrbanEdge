const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');
dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
  return seedProducts();
}).catch(err => console.error('❌ MongoDB Error:', err));

async function seedProducts() {
  const products = [
    {
      name: 'Classic Cotton T-Shirt',
      description: 'Breathable and lightweight cotton t-shirt for everyday wear.',
      price: 499,
      category: 'Clothing',
      stock: 50,
      imageUrl: '/uploads/tshirt.jpeg'
    },
    {
      name: 'Denim Jacket',
      description: 'Stylish blue denim jacket with durable stitching and metal buttons.',
      price: 1599,
      category: 'Clothing',
      stock: 27,
      imageUrl: '/uploads/denim-jacket.jpeg'
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight and comfortable running shoes with EVA sole.',
      price: 2199,
      category: 'Footwear',
      stock: 35,
      imageUrl: '/uploads/running-shoes.jpeg'
    },
    {
      name: 'Leather Loafers',
      description: 'Elegant brown loafers perfect for office and formal wear.',
      price: 1999,
      category: 'Footwear',
      stock: 15,
      imageUrl: '/uploads/leather-loafers.jpeg'
    },
    {
      name: 'Bluetooth Earbuds',
      description: 'Compact wireless earbuds with noise cancellation and charging case.',
      price: 1499,
      category: 'Accessories',
      stock: 40,
      imageUrl: '/uploads/earbuds.jpeg'
    },
    {
      name: 'Stylish Sunglasses',
      description: 'UV-protected polarized sunglasses with sleek black frame.',
      price: 899,
      category: 'Accessories',
      stock: 25,
      imageUrl: '/uploads/sunglasses.jpeg'
    },
    {
      name: 'EdgeX Pro 5G',
      description: 'Powerful 5G smartphone with 64MP camera and 5000mAh battery.',
      price: 25999,
      category: 'Electronics',
      stock: 10,
      imageUrl: '/uploads/edgex-5g.jpeg'
    },
    {
      name: 'FitBand Active 3',
      description: 'Smart fitness tracker with heart rate monitor and sleep tracking.',
      price: 3499,
      category: 'Wearable Tech',
      stock: 30,
      imageUrl: '/uploads/fitband.jpeg'
    },
    {
      name: 'Men’s Beard Grooming Kit',
      description: 'Complete grooming kit with oil, comb, trimmer, and scissors.',
      price: 1299,
      category: 'Lifestyle & Grooming',
      stock: 36,
      imageUrl: '/uploads/beard-kit.jpeg'
    },
    {
      name: 'Printed Kurti Set',
      description: 'Cotton kurti set with dupatta and palazzos, elegant floral print.',
      price: 1899,
      category: 'Women',
      stock: 42,
      imageUrl: '/uploads/kurti-set.jpeg'
    },
    {
      name: "Men's Slim Fit T-shirt",
      description: "Comfortable cotton slim fit t-shirt, perfect for casual wear.",
      price: 499,
      category: 'Clothing',
      stock: 50,
      imageUrl: '/uploads/mens-tshirt.webp'
    },
    {
      name: "Women's Denim Jacket",
      description: "Stylish denim jacket with a cropped fit and button-down front.",
      price: 1399,
      category: 'Women',
      stock: 30,
      imageUrl: '/uploads/womens-jacket.jpg'
    },
    {
      name: "Running Sneakers",
      description: "Lightweight and durable sneakers for everyday workouts.",
      price: 2299,
      category: "Footwear",
      stock: 60,
      imageUrl: "/uploads/running-sneakers.webp"
    },
    {
      name: "Smart Fitness Band",
      description: "Track steps, heart rate, and sleep with this sleek fitness band.",
      price: 1799,
      category: "Wearable Tech",
      stock: 40,
      imageUrl: "/uploads/fitness-band.webp"
    },
    {
      name: "Beard Grooming Kit",
      description: "Complete kit with beard oil, balm, and grooming tools.",
      price: 999,
      category: "Lifestyle & Grooming",
      stock: 25,
      imageUrl: "/uploads/beard-kit.webp"
    },
    {
      name: "Sony - Xperia Z3",
      description: "128GB, 6GB RAM, 64MP Camera, long-lasting battery.",
      price: 15999,
      category: "Electronics",
      stock: 70,
      imageUrl: "/uploads/xperia-z3.jpeg"
    },
    {
      name: "Stylish Analog Watch",
      description: "Classic leather-strap analog watch for everyday wear.",
      price: 1499,
      category: "Accessories",
      stock: 35,
      imageUrl: "/uploads/analog-watch.jpeg"
    },
    {
      name: "Wireless Bluetooth Earbuds",
      description: "Noise cancelling, 20hr playtime, Type-C fast charging.",
      price: 2999,
      category: "Electronics",
      stock: 55,
      imageUrl: "/uploads/boat-earbuds.webp"
    },
    {
      name: "Formal Leather Shoes",
      description: "Polished finish, slip-resistant sole, elegant design.",
      price: 2499,
      category: "Footwear",
      stock: 40,
      imageUrl: "/uploads/leather-shoes.jpeg"
    },
    {
      name: "Women's Handbag",
      description: "PU leather handbag with spacious compartments and zipper closure.",
      price: 1799,
      category: "Women",
      stock: 50,
      imageUrl: "/uploads/xiamen-handbag.jpeg"
    },
    {
      name: "Designer Sunglasses",
      description: "UV-protected stylish sunglasses with a hard case.",
      price: 899,
      category: "Accessories",
      stock: 65,
      imageUrl: "/uploads/hyalus-sunglasses.jpeg"
    },
    {
      name: "Men's Casual Hoodie",
      description: "Warm fleece hoodie with kangaroo pocket and drawstring hood.",
      price: 1299,
      category: "Clothing",
      stock: 45,
      imageUrl: "/uploads/mens-hoodie.jpeg"
    }
  ];

  try {
    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} products added successfully!`);
  } catch (err) {
    console.error('❌ Insertion Error:', err.message);
  } finally {
    mongoose.disconnect();
  }
}