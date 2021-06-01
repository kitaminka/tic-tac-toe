const express = require('express');
const userController = require('../controllers/userController');
const userModule = require('../modules/userModule');

const userRouter = express.Router();

userRouter.get('/auth', (req, res) => {
    if (req.query.code) return userController.authUser(req, res);
    else return res.status(400).send({
        success: false,
        error: 'Bad request'
    });
});
userRouter.use((req, res, next) => {
    return userModule.updateSession(req, res, next);
});
userRouter.get('/update', (req, res) => {
    if (!req.session.user) return res.status(403).send({
        success: false,
        error: 'Forbidden'
    });
    else return userController.updateUserInfo(req, res);
});
userRouter.get('/:id', (req, res) => {
    if (!req.session.user) return res.status(403).send({
        success: false,
        error: 'Forbidden'
    });
    else return userController.getUser(req, res);
});

module.exports = userRouter;