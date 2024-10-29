const router = require('express').Router();
const { notFoundError } = require("../utils/errors")
const { login, createUser } = require('../controllers/users');

const userRouter = require('./users');
const itemRouter = require('./clothingitems');

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