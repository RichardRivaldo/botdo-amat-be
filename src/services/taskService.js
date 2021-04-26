import { Task } from '../models/Task';
import KMP from '../helper/kmp';

const isAllTaskQuestion = question => {
    const allQuestions = ['sejauh ini', 'semua', 'seluruh'];
    for (let allQuestion in allQuestions) {
        if (KMP(question, allQuestion)) return true;
    }
    return false;
};

const getAllTask = async userId => await Task.find({ userId });

export const task = async (req, res) => {
    let tasks;
    const { question } = req.query;
    const { userId } = req.body;

    try {
        if (isAllTaskQuestion(question)) tasks = await getAllTask(userId);
        else throw new Error('Bad request');

        res.status(200).json({
            status: 'Success',
            data: tasks,
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            data: err.message,
        });
    }
};

// export const addTask = async (req, res) => {
//     try {
//         const data = await Task.create({
//             userId: '608688b522900114d02d2adc',
//             name: 'IF2121',
//             jenis: 'Tubes',
//             isFinished: false,
//         });

//         res.status(200).json({
//             status: 'Success',
//             data: data,
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'Failed',
//             data: err.message,
//         });
//     }
// };

// export const getTaskById = async (req, res) => {
//     try {
//         let query = { id: req.body.id };
//         let task = await Task.findOne(query);
//         res.send(task);
//     } catch (err) {
//         res.send({ msg: err });
//     }
// };

// export const setFinishTask = async (req, res) => {
//     try {
//         let query = { id: req.body.id };
//         let update = { isFinished: true };
//         let target = await Task.findOneAndUpdate(query, update);
//         if (target) {
//             res.status(200).send({ msg: 'Task updated!' });
//         } else {
//             res.status(500).send({ msg: 'Something went wrong!' });
//         }
//     } catch (err) {
//         res.send({ msg: err });
//     }
// };
