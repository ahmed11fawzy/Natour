const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const db = mongoose.connect(process.env.MONGODB_URI, {
  
  
});

module.exports = db;