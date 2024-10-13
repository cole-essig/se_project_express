const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require('./routes/index');


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log('Connected to DB');
})
.catch(console.error);

const app = express();
const { PORT = 3001 } = process.env;

app.use("/", mainRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${ PORT}`);
})