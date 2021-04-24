import mongoose from "mongoose";
require("dotenv").config();

const url = process.env.ATLAS_URL;

const connect = mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

export default connect;