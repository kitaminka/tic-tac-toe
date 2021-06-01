const express = require('express');
const roomController = require('../controllers/roomController');
const userModule = require('../modules/userModule');

const roomRouter = express.Router();

roomRouter.use((req, res, next) => {
   if (!req.session.user) return res.status(403).send({
       success: false,
       error: 'Forbidden'
   });
   else return next();
});
roomRouter.use((req, res, next) => {
    return userModule.updateSession(req, res, next);
});
roomRouter.get('/', (req, res) => {
    return roomController.getRooms(req, res);
});
roomRouter.put('/', (req, res) => {
    return roomController.createRoom(req, res);
});
roomRouter.post('/:id', (req, res) => {
    return roomController.joinRoom(req, res);
});
roomRouter.delete('/:id', (req, res) => {
    return roomController.deleteRoom(req, res);
});

module.exports = roomRouter;