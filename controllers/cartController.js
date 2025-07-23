const path = require('path');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  const user = req.user;
  const cart = await Cart.findOne({ userId: user._id }).populate('items.productId');

  const items = cart
    ? cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        imageUrl: item.productId.imageUrl 
      }))
    : [];

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render('user/cart', {
    cart: items,
    totalPrice,
    user,
    cartCount: items.length
  });
};

exports.addToCart = async (req, res) => {
  try {
    const user = req.user;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) return res.redirect('/products');

    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.image
      });
    }

    await cart.save();
    console.log("✅ Cart updated:", cart);
    res.redirect('/cart');

  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).render('user/error', {
      user: req.user,
      cartCount: res.locals.cartCount || 0,
      message: 'Error adding item to cart'
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.redirect('/cart');

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.redirect('/cart');
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).render('user/error', {
      user: req.user,
      cartCount: res.locals.cartCount || 0,
      message: 'Could not remove item. Try again.'
    });
  }
};
