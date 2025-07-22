const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.getHome = async (req, res) => {
  const user = req.user;
  let cartCount = 0;
  if(user){
    const cart = await Cart.findOne({userId: user._id});
    cartCount = cart ? cart.items.length : 0;
  }
  res.render('user/home', {user, cartCount});
};

exports.getProducts = async (req, res) => {
  const user = req.user;
  const selectedCategory = req.query.category;

  const categories = await Product.distinct('category');
  const filter = selectedCategory ? { category: selectedCategory } : {};
  const products = await Product.find(filter);

  res.render('user/products', {
    products,
    user,
    cartCount: req.cartCount,
    categories,
    selectedCategory
  });
};

exports.getProductDetail = async (req, res) => {
  try {
    const user = req.user;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).render('user/error', {
        user,
        cartCount: req.cartCount || 0,
        message: 'Product not found'
      });
    }

    res.render('user/productDetail', { product, user, cartCount: req.cartCount });
  } catch (err) {
    console.error('Error fetching product detail:', err.message);
    return res.status(500).render('user/error', {
      user: req.user || null,
      cartCount: req.cartCount || 0,
      message: 'An unexpected error occurred'
    });
  }
};