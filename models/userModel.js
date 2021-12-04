const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 37
    },
    id: {
        type: String,
        required: true,
        minlength: 18,
        maxlength: 18
    },
    avatar: {
        type: String,
        minlength: 32,
        maxlength: 32,
        default: null
    },
    roomId: {
        type: String,
        minlength: 24,
        maxlength: 24,
        default: null
    },
    accessToken: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', RoomSchema);