const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {requireAuth} = require('../middlewares/authMiddleware');

router.get('/orders', requireAuth, orderController.getOrders);
router.post('/order/delete/:id', requireAuth, orderController.deleteOrder);

module.exports = router;