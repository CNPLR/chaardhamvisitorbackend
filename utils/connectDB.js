const mongoose = require('mongoose');
const connection = {};
require('dotenv').config()

async function connectDB() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI,);
  console.log("Database connected :)")
  connection.isConnected = db.connections[0].readyState;
}

module.exports = connectDB;