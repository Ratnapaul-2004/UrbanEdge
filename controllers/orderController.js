const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.getOrders = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect('/login?message=login_required');

    const orders = await Order.find({ user: user._id });
    const cart = await Cart.findOne({ userId: user._id });
    const cartCount = cart?.items?.length || 0;

    res.render('user/orders', { orders, user, cartCount });
  } catch (err) {
    console.error('Orders Error:', err);
    res.status(500).render('user/error', {
      user: req.user || null,
      cartCount: 0,
      message: 'Failed to fetch your orders'
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const user = req.user;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: user._id });
    if (!order) {
      return res.status(403).render('user/error', {
        user,
        cartCount: 0,
        message: 'Order not found or unauthorized'
      });
    }

    await Order.deleteOne({ _id: orderId });
    res.redirect('/orders');
  } catch (err) {
    console.error('Delete Order Error:', err);
    res.status(500).render('user/error', {
      user: req.user || null,
      cartCount: 0,
      message: 'Failed to delete order'
    });
  }
};