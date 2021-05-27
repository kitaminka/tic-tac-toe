const express = require('express');
const gameController = require('../controllers/gameController');
const userModule = require('../modules/userModule');

const gameRouter = express.Router();

gameRouter.use((req, res, next) => {
    if (!req.session.user) return res.redirect('/');
    else return next();
});
gameRouter.use((req, res, next) => {
    return userModule.updateSession(req, res, next);
});
gameRouter.get('/', (req, res) => {
    return gameController.homePage(req, res);
});
gameRouter.get('/:id', (req, res) => {
    return gameController.roomPage(req, res);
});

module.exports = gameRouter;