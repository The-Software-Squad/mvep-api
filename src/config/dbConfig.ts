import mongoose from "mongoose";
import logger from "../utils/logger";

/**
 * Connects to the MongoDB database
 *
 * @param retries number of retries
 * @param delay delay in milliseconds
 */
export const connectDB = async (retries = 5, delay = 10000) => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        logger.info('Mongodb URI is missing in env');
        process.exit(1);
    }
    while (retries) {
        try {
            //TODO: Replace the connection string with an environment variable.
            const conn = await mongoose.connect(
                mongoURI
            );
            logger.info(`MongoDB Connected: ${conn.connection.host}`);
            break;
        } catch (error: any) {
            logger.error(`Error: ${error.message}`);
            retries -= 1;
            logger.info(`Retries left: ${retries}`);
            if (retries === 0) {
                logger.info("No more retries left. Exiting...");
                process.exit(1);
            }
            logger.info(`Retrying in ${delay / 1000} seconds...`);
            await new Promise((res) => setTimeout(res, delay));
        }
    }
};