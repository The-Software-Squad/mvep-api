import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user-route";

// Get the env variables.
import { config } from "dotenv"

config();

// Get the env variables.
const PORT = process.env.PORT || 5000;
import { notFound, errorMiddleWare } from "./middleware/error-middleware";
import logger from "./utils/logger";
import { connectDB } from "./services/database-service";
import SudoUserRouter from "./routes/sudouser-route";



// Define the express app.
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Add the routes.
app.get('/', (req, res) => {
  res.send('MVEP API');
});
//user routes
app.use('/api/user', userRouter)


app.use("/api/sudo-users/", SudoUserRouter);


// error middleware

app.use(notFound);
app.use(errorMiddleWare);

app.listen(PORT, () => {
  connectDB();
  logger.info(`start the server http://localhost:${PORT}`)
});
