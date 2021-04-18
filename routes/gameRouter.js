const express = require('express');
const gameController = require('../controllers/gameController');

const gameRouter = express.Router();

gameRouter.use((req, res, next) => {
    if (!req.session.user) return res.redirect('/');
    else return next();
});
gameRouter.get('/', (req, res) => {
    return gameController.homePage(req, res);
});

module.exports = gameRouter;