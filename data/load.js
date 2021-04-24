/*eslint-disable*/
const fs = require("fs");
const User = require("../src/models/User");
const Task = require("../src/models/Task");
// const Chat = require("../src/models/Chat");

const dotenv = require("dotenv");

dotenv.config({ path: "../../config.env" });

const mongoose = require("mongoose");
const db = process.env.ATLAS_URL;
(async () => {
  await mongoose.connect(db, {
    // options for deal some deprecations warning when creating our app
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log("Database connection successful");
})();

// const chat = JSON.parse(fs.readFileSync(`${__dirname}/chat.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/user.json`, "utf-8"));
const tasks = JSON.parse(fs.readFileSync(`${__dirname}/task.json`, "utf-8"));

const updateItem = async () => {
  await User.create(users);
  await Task.create(tasks);
  // await Chat.create(chat);

  console.log("Update Item");
  process.exit();
};

const deleteItem = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  // await Chat.deleteMany();

  console.log("Delete Items");
  process.exit();
};

if (process.argv.includes("--update")) {
  updateItem();
} else if (process.argv.includes("--delete")) {
  deleteItem();
}