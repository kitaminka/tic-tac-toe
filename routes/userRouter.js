const express = require('express');
const userController = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.use('/auth', userController.authUser);
userRouter.use('/', userController.getUsers);

module.exports = userRouter;