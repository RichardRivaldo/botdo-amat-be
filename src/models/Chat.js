const mongoose = require("mongoose");
const { User } = require('./User');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: User,
        },
        isRobot: {
            type: Schema.Types.Boolean,
            default: false,
        },
    },
    {
        collection: 'chats',
        timestamps: true,
    },
);

exports.Chat = mongoose.model('Chat', chatSchema);
