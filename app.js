require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { errors } = require('celebrate');

const { PORT = 3001 } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/routes');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(requestLogger);

app.use(cors(corsOptions));

app.use(helmet());

app.use(cookieParser());

app.use(express.json());

app.use(cors());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(limiter);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Поключён ${PORT} порт`);
});

app.use((err, _req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
