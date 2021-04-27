import { Task } from '../models/Task';
import { getKodeMatkul, getDate, getKeyword } from '../helper/string_matching';
import KMP from '../helper/kmp';

// Get All Task
const isAllTaskQuestion = question => {
    const questionPattern = ['sejauh ini', 'semua', 'seluruh'];
    for (let i = 0; i < questionPattern.length; i++) {
        if (KMP(question, questionPattern[i]).length) return true;
    }
    return false;
};
const getAllTask = async userId => ({ res: await Task.find({ userId }), method: 'get' });

// Add Task
const isAddTask = question => {
    const courseId = getKodeMatkul(question);
    const date = getDate(question);
    const type = getKeyword(question);

    return courseId && date && type;
};

const addTask = async (question, userId) => {
    const courseId = getKodeMatkul(question);
    const date = getDate(question);
    const type = getKeyword(question);
    const { year: yyyy, month: mm, date: dd } = date.groups;

    let topic;
    topic = question
        .slice(KMP(question, courseId[0]))
        .replace(courseId[0], '')
        .replace(date[0], '')
        .replace(/pada|tentang|mengenai/gi, '')
        .trim();

    console.log(new Date(`${mm}-${dd}-${yyyy}`));

    const tasks = await Task.create({
        userId,
        date: new Date(`${mm}-${dd}-${yyyy}`),
        name: courseId[0],
        jenis: type,
        isFinished: false,
    });

    console.log(topic);
    return { res: tasks, method: 'add' };
};

export const task = async (req, res) => {
    let tasks;
    const { question } = req.query;
    const { userId } = req.body;

    try {
        if (isAllTaskQuestion(question)) tasks = await getAllTask(userId);
        else if (isAddTask(question)) tasks = await addTask(question, userId);
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
