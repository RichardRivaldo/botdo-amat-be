const fs = require('fs');
const { Task } = require('../src/models/Task');

const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });

const mongoose = require('mongoose');
const db = process.env.ATLAS_URL;
(async () => {
    await mongoose.connect(db, {
        // options for deal some deprecations warning when creating our app
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
    console.log('Database connection successful');
})();

const tasks = JSON.parse(fs.readFileSync(`${__dirname}/task.json`, 'utf-8'));

const updateItem = async () => {
    await Task.create(tasks);

    console.log('Update Item');
    process.exit();
};

const deleteItem = async () => {
    await Task.deleteMany();

    console.log('Delete Items');
    process.exit();
};

if (process.argv.includes('--update')) {
    updateItem();
} else if (process.argv.includes('--delete')) {
    deleteItem();
}
