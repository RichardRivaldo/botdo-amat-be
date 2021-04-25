const mongoose = require("mongoose");
const { Task } = require('./Task');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: Task,
        },
    },
    {
        collection: 'chats',
        timestamps: true,
    },
);

exports.Chat = mongoose.model('Chat', chatSchema);
