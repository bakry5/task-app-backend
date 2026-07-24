const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: '.env' });

const dbConnection = require('./config/database');

dbConnection();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

const PORT = process.env.PORT || 8000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error('Shutting down....');
      process.exit(1);
    });
  });
}

module.exports = app;
