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
├── controllers/
├── models/
├── routes/
├── views/
│   ├── layouts/
│   └── auth/
├── public/
│   ├── uploads/
│   └── profile_uploads/
├── config/
├── .env
├── app.js
├── package.json
└── README.md
``` </code></pre>

## 🔧 Environment Setup
1. Clone the repository
   git clone https://github.com/your-username/UrbanEdge.git
   cd UrbanEdge
