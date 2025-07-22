const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {requireAuth} = require('../middlewares/authMiddleware');

router.get('/', requireAuth, userController.getHome);
router.get('/products', requireAuth, userController.getProducts);
router.get('/products/:id', requireAuth, userController.getProductDetail);

module.exports = router;