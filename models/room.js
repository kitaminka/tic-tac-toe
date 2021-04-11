const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    owner: {
        type: String,
        minlength: 18,
        maxlength: 18,
        required: true,
    },
    members: {
        type: Array,
        required: true,
        minlength: 1,
    },
    private: {
        type: Boolean,
        required: true,
        minlength: 1,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Room', RoomSchema);