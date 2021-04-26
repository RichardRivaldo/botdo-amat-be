const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    name: {
        type: String,
        required: true,
    },
    jenis: {
        type: String,
        required: true,
    },
    isFinished: {
        type: Boolean,
        required: true,
        default: false,
    },
});

exports.Task = mongoose.model('Task', taskSchema);
