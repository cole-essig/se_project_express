const userRouter = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateId, validateModifyUserData } = require('../middlewares/validation')

userRouter.get('/me', auth, validateId, getCurrentUser);
userRouter.patch('/me', auth, validateModifyUserData, updateProfile);

module.exports = userRouter;