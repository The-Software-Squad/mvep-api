import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/dbConfig";
import userRouter from "./routes/user.route";
import 'dotenv/config'

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
app.use('/api', userRouter)

connectDB();
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at ${PORT}`);
});
