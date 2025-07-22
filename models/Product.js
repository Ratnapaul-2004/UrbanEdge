const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true 
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Clothing', 'Footwear', 'Accessories', 'Electronics', 'Wearable Tech', 'Lifestyle & Grooming', 'Women'],
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);