const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connDb = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${connDb.connection.host}`);
  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;