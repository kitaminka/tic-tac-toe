const express = require('express');
const roomController = require('../controllers/roomController');

const roomRouter = express.Router();

roomRouter.use((req, res, next) => {
   if (!req.session.user) return res.status(403).send('Forbidden');
   else return next();
});
roomRouter.get('/', (req, res) => {
    return roomController.getRooms(req, res);
});
roomRouter.put('/', (req, res) => {
    return roomController.createRoom(req, res);
});
roomRouter.get('/:id', (req, res) => {
    return roomController.joinRoom(req, res);
});

module.exports = roomRouter;