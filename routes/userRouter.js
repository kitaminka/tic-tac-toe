const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/auth', (req, res) => {
    if (req.query.code) return userController.authUser(req, res);
    else return res.status(403).send('Forbidden');
});
userRouter.get('/:id', (req, res) => {
   return userController
});

module.exports = userRouter;