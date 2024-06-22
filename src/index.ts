import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound,errorMiddleWare } from "./middleware/error.middleware";
import logger from "./utils/logger";
import { connectDB } from "./services/database-service";
// Get the env variables.
const PORT = process.env.PORT || 4000;

// Define the express app.
const app = express();

// Add the middlewares.
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Add the routes.
app.get("/", (req, res) => {
  res.send("MVEP API");
});

// error middleware

app.use(notFound);
app.use(errorMiddleWare);

app.listen(PORT, () => {
  connectDB();
  logger.info(`start the server http://localhost:${PORT}`)
});
