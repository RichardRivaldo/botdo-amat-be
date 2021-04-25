import { Task } from '../models/Task';

export const getAllTask = async (req, res) => {
    try {
        let tasks = await Task.find();
        res.send(tasks);
    } catch (err) {
        res.send({ msg: err });
    }
};

export const getTaskById = async (req, res) => {
    try {
        let query = { id: req.body.id };
        let task = await Task.findOne(query);
        res.send(task);
    } catch (err) {
        res.send({ msg: err });
    }
};

export const setFinishTask = async (req, res) => {
    try {
        let query = { id: req.body.id };
        let update = { isFinished: true };
        let target = await Task.findOneAndUpdate(query, update);
        if (target) {
            res.status(200).send({ msg: 'Task updated!' });
        } else {
            res.status(500).send({ msg: 'Something went wrong!' });
        }
    } catch (err) {
        res.send({ msg: err });
    }
};
