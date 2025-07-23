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
- 🔐 JWT-based Signup/Login with hashed passwords
- 🛒 Product Listing, detail view, add-to-cart
- 📦 Checkout Flow with address capture
- 🧾 Order History per user
- 👤 Profile Picture Upload
- 🖼️ Admin Product Image Upload
- 🛡️ Google reCAPTCHA on login to prevent bots
- 📁 Session and Cookie Management
- 🚫 Access Control with middleware
- ⚠️ Friendly Error Pages

## 📦 Project Structure
<pre lang="markdown"><code>
```
UrbanEdge/
├── config/                         # Configuration files
│   ├── db.js                       # MongoDB connection
│   └── multer.js                   # Multer storage configuration
├── controllers/                    # Route controllers
│   ├── authController.js           # Signup, login, logout, password reset
│   └── userController.js           # User logic
│   └── cartController.js           # Cart logic
│   └── orderController.js          # Order placement/history
│   └── checkoutController.js       # Address & checkout logic
│   └── adminController.js          # Admin activities(Product CRUD)  
├── models/                         # Mongoose models
│   ├── User.js
│   └── Product.js
│   └── Cart.js
│   └── Order.js
├── routes/                         # Express route definitions
│   ├── authRoutes.js
│   └── userRoutes.js
│   └── cartRoutes.js
│   └── checkoutRoutes.js
│   └── orderRoutes.js
│   └── adminRoutes.js
├── views/                          # EJS view
|   ├── admin/                     
│   │   ├── dashboard.ejs
│   │   └── products.ejs
│   │   └── newProduct.ejs
│   │   └── editProduct.ejs   
│   ├── auth/                       # login, signup, forgot password, logout
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
├── public/                        # Static assets
│   ├── css/
│       ├── style.css
|   └── images/                    # Dashboard product images
|       ├── categories/ 
|   └── uploads/                   # Product images
│   └── profile_uploads/           # Profile pictures
├── middlewares/                   # Custom middleware 
│   ├── adminMiddleware.js
│   └── authMiddleware.js
|   └── imageMiddleware.js
├── .env                           # Environment variables
├── .gitignore
├── app.js                         # Main route handler
├── package-lock.json
├── package.json
├── seed.js                        # Product populator(Admin)
├── server.js                      # Server
└── README.md

``` </code></pre>

## 🔐 Authentication Flow
- Signup/Login → stores JWT in cookies
- Protected Routes (like /cart, /checkout) require a valid JWT
- Logout → clears cookie
- reCAPTCHA validation during login to prevent spam bots
- Profile Pic Upload during signup and editable after login

## 📦 Admin Panel
- Login as Admin → /admin/dashboard
- Add/Edit/Delete Products
- Upload Product Images via Multer
- Admin Middleware restricts access to protected routes

## 👤 User Panel
- Browse products
- Add to Cart
- Checkout with address
- View Order History
- Change Profile Picture
- Error page for failed routes

## 🔒 Google reCAPTCHA
Integrated reCAPTCHA v2 in the login page for spam protection.

## 📸 Media Upload
- Product Images → stored in public/uploads
- Profile Pictures → stored in public/profile_uploads
- Handled via multer.js in the config/ folder

## 📎 Future Enhancements (Suggestions)
- User Image updation
- Wishlist functionality
- Razorpay/Stripe Payment Gateway
- Email verification
- Admin order management
- Product category filtering
- Ratings & Reviews

## 📬 License
This project is open-source under the MIT License.

`` Made with ❤️ by Ratnadeep Paul ``
