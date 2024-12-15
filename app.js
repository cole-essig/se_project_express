const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const mainRouter = require('./routes/index');
const errorHandler = require('./middlewares/error-handler')
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {});
}