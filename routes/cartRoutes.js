const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {requireAuth} = require('../middlewares/authMiddleware');

router.get('/cart', requireAuth, cartController.getCart);
router.post('/cart/add/:productId', requireAuth, cartController.addToCart);
router.post('/cart/remove/:productId', requireAuth, cartController.removeFromCart);

module.exports = router;