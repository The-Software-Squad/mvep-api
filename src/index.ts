import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/dbConfig";
import userRouter from "./routes/user-route";
import 'dotenv/config'
import { errorMiddleWare, notFound } from "./middleware/error-middleware";
import logger from "./utils/logger";

// Get the env variables.
const PORT = process.env.PORT || 5000;

// Define the express app.
const app = express();

// Add the middlewares.
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Add the routes.
app.get('/', (req, res) => {
  res.send('MVEP API');
});
//user routes
app.use('/api/user', userRouter)

//middlewares
app.use(notFound)
app.use(errorMiddleWare)


app.listen(PORT, () => {
  connectDB()
  logger.info(`Server started at ${PORT}`);
});
