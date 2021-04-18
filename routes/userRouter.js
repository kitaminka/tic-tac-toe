const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/auth', (req, res) => {
    if (req.query.code) return userController.authUser(req, res);
    else return res.status(400).send('Bad Request');
});
userRouter.get('/:id', (req, res) => {
    if (!req.session.user) return res.status(403).send('Forbidden');
    else return userController.getUser(req, res);
});

module.exports = userRouter;