const userRouter = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateModifyUserData } = require('../middlewares/validation')

userRouter.get('/me', auth, getCurrentUser);
userRouter.patch('/me', auth, validateModifyUserData, updateProfile);

module.exports = userRouter;