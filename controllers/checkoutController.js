const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.getCheckout = async (req, res) => {
  const user = req.user;
  const cart = await Cart.findOne({userId: user._id});
  const items = cart ? cart.items : [];
  res.render('user/checkout', {
    cart: items, 
    user, 
    cartCount: items.length
  });
};

exports.postCheckout = async (req, res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOne({ userId: user._id }).lean();

    console.log('Cart Found:', cart);
    console.log('Cart Items:', cart.items);

    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty or not found');
      return res.redirect('/cart');
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: user._id,
      items: cart.items,
      address: req.body.address,
      total,
      date: new Date()
    });

    console.log('Created Order:', order);

    if (!order || !order._id) {
      throw new Error('Order creation failed or _id missing');
    }

    console.log("Final Order Object:", order);
    console.log("Cart Items Length:", cart.items.length);
    console.log("Redirecting to order confirmation page with ID:", order._id);
    res.redirect(`/order-confirmation/${order._id}`);
  } catch (err) {
    console.error('Checkout Error:', err);
    res.status(500).render('user/error', {
      user: req.user,
      cartCount: res.locals.cartCount || 0,
      message: 'Order failed, please try again'
    });
  }
};

exports.getOrderConfirmation = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!orderId) {
      console.log("Order ID missing from params");
      return res.status(400).render('user/error', {
        user: req.user,
        cartCount: res.locals.cartCount || 0,
        message: 'Invalid order ID'
      });
    }

    const order = await Order.findById(orderId).populate('user');

    if (!order) {
      console.log("Order not found for ID:", orderId);
      return res.status(404).render('user/error', {
        user: req.user,
        cartCount: res.locals.cartCount || 0,
        message: 'Order not found'
      });
    }

    res.render('user/orderConfirmation', {
      user: req.user,
      cartCount: res.locals.cartCount || 0,
      order
    });
  } catch (err) {
    console.error("Error fetching order confirmation:", err);
    res.status(500).render('user/error', {
      user: req.user,
      cartCount: res.locals.cartCount || 0,
      message: 'Something went wrong!'
    });
  }
};