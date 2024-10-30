const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingitems');
const { notFoundError } = require("../utils/errors")
const { login, createUser } = require('../controllers/users');

console.log(userRouter);
router.use('/users', userRouter);
router.use('/items', itemRouter);
router.post('/signin', login);
router.post('/signup', createUser);
router.use((req, res) => {
  res
    .status(notFoundError)
    .send({ message: "Requested resource not found" });
});

module.exports = router;