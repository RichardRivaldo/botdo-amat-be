import express from "express";
const router = express.Router();

const {Task} = require("../models/Task");

router.get("/", async (req, res) => {
	try {
		let tasks = await Task.find();
		res.send(tasks);
	} catch (err) {
		res.send({msg: err});
	}
});

export default router;