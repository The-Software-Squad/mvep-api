import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound,errorMiddleWare } from "./middleware/error-middleware";
import logger from "./utils/logger";
import { connectDB } from "./services/database-service";
import SudoUserRouter from "./routes/sudouser-route";

// Get the env variables.
import {config} from "dotenv"
import regionRouter from "./routes/region-route";

config();
const PORT = process.env.PORT || 4000;

// Define the express app.
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Add the routes.
app.get('/', (req, res) => {
  res.send('MVEP API');
});

app.use("/api/sudo-users/" , SudoUserRouter);
app.use("/api/region" , regionRouter);

// error middleware

app.use(notFound);
app.use(errorMiddleWare);

app.listen(PORT, () => {
  connectDB();
  logger.info(`start the server http://localhost:${PORT}`)
});
