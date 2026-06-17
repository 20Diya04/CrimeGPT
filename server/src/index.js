require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const uploadRoutes = require('./routes/upload');
const documentRoutes = require('./routes/documents');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
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
