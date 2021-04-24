const mongoose = require("mongoose");
const userSchema = require("./User");
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema(
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
		},
		user: {
            type: Schema.Types.ObjectId,
            ref: Task
        }
	},
	{
		collection: "chats",
	}
);

exports.Employee = mongoose.model("Employee", taskSchema);
