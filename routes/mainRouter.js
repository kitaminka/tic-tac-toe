const express = require('express');
const mainController = require('../controllers/mainController.js');

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    if (!req.session.user) return mainController.authPage(req, res);
    else return res.redirect('/game');
});

module.exports = homeRouter;