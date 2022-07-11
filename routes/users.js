const userRouter = require('express').Router();

const {
  getUsers,
  updateUserProfile,
} = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validations');

userRouter.get('/me', getUsers);

userRouter.patch('/me', validateUpdateUser, updateUserProfile);

module.exports = userRouter;
