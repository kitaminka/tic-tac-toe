const express = require('express');
const gameController = require('../controllers/gameController');

const gameRouter = express.Router();

gameRouter.get('/', (req, res) => {
    if (req.session.user) return gameController.homePage(req, res);
    else return res.redirect('/');
});

module.exports = gameRouter;