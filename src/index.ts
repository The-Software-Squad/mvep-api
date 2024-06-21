import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './services/database-service';

const mongoURL = process.env.MONGO_URI;

// Get the env variables.
const PORT = process.env.PORT || 4000;

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

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at ${PORT}`);
});
