const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { TUGAS } = require('../helper/const');

const { KUIS, UJIAN, PR, TUCIL, TUBES, PRAKTIKUM } = TUGAS;

const taskSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
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
    kode: {
        type: String,
        required: true,
    },
    jenis: {
        type: String,
        enum: [KUIS, UJIAN, PR, TUCIL, TUBES, PRAKTIKUM],
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    isFinished: {
        type: Boolean,
        required: true,
        default: false,
    },
});

autoIncrement.initialize(mongoose.connection);
taskSchema.plugin(autoIncrement.plugin, 'Task');
exports.Task = mongoose.model('Task', taskSchema);
