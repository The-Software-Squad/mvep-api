
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound,errorMiddleWare } from "./middleware/error.middleware";
import logger from "./utils/logger";
import { connectDB } from "./services/database-service";
import SudoUserRouter from "./routes/sudouser.route";
import SudoUser from "./models/sudouser.model";
import { default_super_admin_caps } from "./constants/capabilities";

// Get the env variables.
const PORT = process.env.PORT || 4000;

// Define the express app.
const app = express();

// (async function(){
     
//   const root  = await SudoUser.create({
//      name : "root",
//      email : "root@gmail.com",
//      phone_number : "9812737891",
//      password : "12345",
//      capabilities : default_super_admin_caps,
//      role:1,
//      createdBy :"root"
//   });

// })()

// Add the middlewares.
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Add the routes.
app.get('/', (req, res) => {
  res.send('MVEP API');
});

app.use("/api/sudo-users/" , SudoUserRouter);


// error middleware

app.use(notFound);
app.use(errorMiddleWare);

app.listen(PORT, () => {
  connectDB();
  logger.info(`start the server http://localhost:${PORT}`)
});
