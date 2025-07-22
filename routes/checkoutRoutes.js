const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const {requireAuth} = require('../middlewares/authMiddleware');

router.get('/checkout', requireAuth, checkoutController.getCheckout);
router.post('/checkout', requireAuth, checkoutController.postCheckout);
router.get('/order-confirmation/:orderId', requireAuth, checkoutController.getOrderConfirmation);

module.exports = router;