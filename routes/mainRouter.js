const express = require('express');
const mainController = require('../controllers/mainController.js');

const homeRouter = express.Router();

homeRouter.get('/', mainController.auth);

module.exports = homeRouter;