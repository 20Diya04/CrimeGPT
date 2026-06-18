import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import caseRoutes from "./routes/cases.js";
import uploadRoutes from "./routes/upload.js";
import documentRoutes from "./routes/documents.js";
import errorHandler from "./middleware/errorHandler.js";

import UserRoute from "./routes/UserRoutes.js";

dotenv.config();
const app = express();
console.log(process.env.ACCOUNT_SID);
console.log(process.env.TWILIO_NO);
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/User', UserRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`CrimeGPT server listening on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to MongoDB', error);
  process.exit(1);
});
