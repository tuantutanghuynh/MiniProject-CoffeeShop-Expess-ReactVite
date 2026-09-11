const mongoose = require('mongoose');
const env = require('./env');

/**
 * Connect to MongoDB database using Mongoose and env config
 */
const logger = require('./logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI);
        logger.info(`MongoDB Connected Successfully to database: ${conn.connection.name} at ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
