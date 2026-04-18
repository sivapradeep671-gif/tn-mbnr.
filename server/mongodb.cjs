const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const config = require('./config/secrets.cjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tn_mbnr';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Fail fast if Mongo is not running
        });
        console.log('✅ Connected to MongoDB Regional Node (TN-MBNR Cluster)');
        return true;
    } catch (err) {
        console.warn('❌ MongoDB Cluster Unreachable. Using SQLite Fallback Node.');
        return false;
    }
};

module.exports = connectDB;
