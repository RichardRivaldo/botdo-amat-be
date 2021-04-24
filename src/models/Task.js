const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema(
	{
		id: {
			type: Number,
			required: true,
			unique: true,
		},
		date: {
			type: Date,
			required: true,
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
            required : true,
			default: false,
		},
	},
	{
		collection: "tasks",
	}
);

exports.Employee = mongoose.model("Employee", taskSchema);
