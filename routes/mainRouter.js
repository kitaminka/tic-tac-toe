const express = require('express');
const mainController = require('../controllers/mainController.js');

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    if (req.session.username) mainController.homePage(req, res);
    else mainController.authPage(req, res);
});

module.exports = homeRouter;