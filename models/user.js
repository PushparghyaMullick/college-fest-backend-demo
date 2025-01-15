const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['student', 'manager', 'admin'],
        default: 'student',
        required: true
    },
    events: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Event',
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);