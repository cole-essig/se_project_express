const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingitems');
const { NotFoundError } = require("../errors/NotFoundError");
const { login, createUser } = require('../controllers/users');
const { validateUserCreation, validateLoginAuth } = require('../middlewares/validation')

router.use('/users', userRouter);
router.use('/items', itemRouter);
router.post('/signin', validateLoginAuth, login);
router.post('/signup', validateUserCreation, createUser);

router.use((req, res) => {
  throw new NotFoundError(
    "The requested resource was not found on the server. Please check your request and try again."
  );
});

module.exports = router;