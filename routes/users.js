const userRouter = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const { auth } = require('../middlewares/auth')

// router.get('/', getUsers);
// router.get('/:userId', getUser);
// router.post('/', createUser);
userRouter.get('/me', auth, getCurrentUser);
userRouter.patch('/me', auth, updateProfile);

module.exports = userRouter;