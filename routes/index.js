const router = require('express').Router();
const { notFoundError } = require("../utils/errors")

const userRouter = require('./users');
const itemRouter = require('./clothingitems');

router.use('/users', userRouter);
router.use('/items', itemRouter);
router.use((req, res) => {
  res
    .status(notExistingError)
    .send({ message: "Requested resource not found" });
});

module.exports = router;