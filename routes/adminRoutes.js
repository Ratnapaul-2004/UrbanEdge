const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {requireAuth, requireAdmin} = require('../middlewares/authMiddleware');
const {productUpload} = require('../config/multer');

router.get('/dashboard', requireAuth, requireAdmin, adminController.getDashboard);
router.get('/products', requireAuth, requireAdmin, adminController.getAllProducts);
router.get('/products/new', requireAuth, requireAdmin, adminController.getNewProduct);
router.post('/products', requireAuth, requireAdmin, productUpload.single('image'), adminController.createProduct);
router.get('/products/:id/edit', requireAuth, requireAdmin, adminController.editProduct);
router.post('/products/:id/edit', requireAuth, requireAdmin, productUpload.single('image'), adminController.updateProduct);
router.post('/products/:id/delete', requireAuth, requireAdmin, adminController.deleteProduct);

module.exports = router;