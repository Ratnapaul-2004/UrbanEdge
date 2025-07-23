# 🛍️ UrbanEdge – E-Commerce Backend
A fully-featured backend system for an online e-commerce platform named UrbanEdge, supporting user authentication, cart management, product listings, checkout process, order handling, and Google reCAPTCHA security integration.

## 🚀 Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Templating Engine: EJS
- Authentication: JWT + bcrypt.js
- Security: Google reCAPTCHA v2
- Others: Multer, dotenv, express-session, cookie-parser

## ✨ Features
- 🔐 User Signup/Login with JWT
- 🛒 Product listing and cart
- 📦 Checkout with address capture
- 🧾 Order history
- 📁 Profile and Product image uploads (Multer)
- ✅ Google reCAPTCHA on login
- 📦 Session and Cookie management
- 📄 Error handling with friendly UI messages

## 📦 Project Structure
<pre lang="markdown"><code>
```
UrbanEdge/
├── config/                       # Configuration files
│   ├── db.js                     # MongoDB connection
│   └── multer.js                 # Multer storage configuration
├── controllers/                  # Route controllers
│   ├── authController.js         # Signup, login, logout, password reset
│   ├── userController.js         # User logic
│   ├── cartController.js         # Cart logic
│   ├── orderController.js        # Order placement/history
│   └── checkoutController.js     # Address & checkout logic
│   └── adminController.js        # Admin activities(Product CRUD)  
├── models/                       # Mongoose models
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/                       # Express route definitions
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── cartRoutes.js
│   ├── checkoutRoutes.js
│   └── orderRoutes.js
│   └── adminRoutes.js
├── views/                        # EJS view
|   ├── admin/                     
│   │   ├── dashboard.ejs
│   │   └── products.ejs
│   │   └── newProduct.ejs
│   │   └── editProduct.ejs   
│   ├── auth/                     # login, signup, forgot password, logout
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │   └── forgotPassword.ejs
│   │   └── logout.ejs
│   ├── layouts/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── user/
|   |   ├── cart.ejs
|   |   └── checkout.ejs
|   |   └── error.ejs
|   |   └── home.ejs
|   |   └── orderConfirmation.ejs
|   |   └── orders.ejs
|   |   └── productDetail.ejs
|   |   └── products.ejs
├── public/                      # Static assets
│   ├── css/
│       ├── style.css
|   ├── images/                  # Dashboard product images
|       └── categories/ 
|   ├── uploads/                 # Product images
│   └── profile_uploads/         # Profile pictures
├── middlewares/                 # Custom middleware 
│   ├── adminMiddleware.js
│   └── authMiddleware.js
|   └── imageMiddleware.js
├── .env                          # Environment variables
├── .gitignore
├── app.js                        # Main route handler
├── package-lock.json
├── package.json
├── seed.js                       # Product populator(Admin)
├── server.js                     # Server
└── README.md

``` </code></pre>
