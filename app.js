const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require('cors');
const { errors } = require('celebrate');
const mainRouter = require('./routes/index');
const errorHandler = require('./middlewares/error-handler')
const { requestLogger, errorLogger } = require('./middlewares/logger');



mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use("/", errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {});
}