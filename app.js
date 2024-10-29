const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const mainRouter = require('./routes/index');


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();
const { PORT = 3001 } = process.env;

// app.use((req, res, next) => {
//   req.user = {
//     _id: '670c234b7d6ab0901d6c2740',// paste the _id of the test user created in the previous step
//   };
//   next();
// });
app.use(express.json());
app.use(cors());
app.use("/", mainRouter)

app.listen(PORT, () => {})