const express = require('express');
const roomController = require('../controllers/roomController');

const roomRouter = express.Router();

roomRouter.get('/', (req, res) => {
    if (req.session.user) return roomController.getRooms(req, res);
    else return res.redirect('/');
});
roomRouter.put('/', (req, res) => {
    if (req.session.user) return roomController.createRoom(req, res);
    else return res.redirect('/');
});
roomRouter.get('/:id', (req, res) => {
    if (req.session.user) return roomController.joinRoom(req, res);
    else return res.redirect('/');
});

module.exports = roomRouter;