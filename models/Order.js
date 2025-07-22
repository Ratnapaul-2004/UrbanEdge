const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  address: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);