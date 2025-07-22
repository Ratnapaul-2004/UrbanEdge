const Product = require('../models/Product');

exports.getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    user: req.user,
    cartCount: req.cartCount || 0
  });
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  console.log('Products:', products.map(p => p.imageUrl));

  res.render('admin/products', {
    products,
    user: req.user,
    cartCount: req. cartCount,
    query: req.query
  });
};

exports.getNewProduct = (req, res) => {
  res.render('admin/newProduct', {
    user: req.user,
    cartCount: req.cartCount
  });
};

exports.createProduct = async (req, res) => {
  console.log('Uploaded file:', req.file);
  const { name, price, description, category, stock } = req.body;  
  let imageUrl = '';

  const product = new Product({
    name,
    price,
    description,
    imageUrl:  '/uploads/' + req.file.filename,
    category,
    stock
  });

  if(req.file) {
    imageUrl = '/uploads/' + req.file.filename;
  }

  await product.save();
  res.redirect('/admin/products?message=Product added successfully');
};

exports.editProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/editProduct', {
    product,
    user:req.user,
    cartCount: req.cartCount
  });
};

exports.updateProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  const updateData = {
  name, 
  price, 
  description,
  category,
  stock
  };

  if (req.file) {
    updateData.imageUrl = '/uploads/' + req.file.filename;
  }

  await Product.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin/products?message=Product updated');
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
};