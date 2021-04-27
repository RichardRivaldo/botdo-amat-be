import { Task } from '../models/Task';
import { getKodeMatkul, getDate, getKeyword, get2Date, getNDate } from '../helper/string_matching';
import { postChatFromUser, postChatFromBot } from './chatService.js';
import KMP from '../helper/kmp';

// Get All Task
const isAllTaskQuestion = question => {
    const questionPattern = ['sejauh ini', 'semua', 'seluruh'];
    for (let i = 0; i < questionPattern.length; i++) {
        if (KMP(question, questionPattern[i]).length) return true;
    }
    return false;
};

// Add Task
const isAddTask = question => {
    const courseId = getKodeMatkul(question);
    const date = getDate(question);
    const type = getKeyword(question);

    console.log('INI DARI ADD TASK');
    console.log(courseId && date && type);

    return courseId && date && type;
};

const isTaskBetween = question => {
    return get2Date(question);
};

const isTaskAhead = question => {
    return getNDate(question);
};

const getAllTask = async userId => ({ res: await Task.find({ userId }), method: 'get' });

const getTasksBetween = async (userId, str) => {
    if (get2Date(str)) {
        const { date1, date2 } = get2Date(str);
        const res = Task.find({
            //query today up to tonight
            userId,
            date: {
                $gte: new Date(date1),
                $lt: new Date(date2),
            },
        });
        return { res, method: 'get' };
    } else {
        return { res: [], method: 'get' };
    }
};

const getTaskAhead = (userId, str) => {
    const temp = getNDate(str);
    if (temp) {
        const { date1, date2 } = temp;
        const res = Task.find({
            //query today up to tonight
            userId,
            date: {
                $gte: new Date(date1),
                $lt: new Date(date2),
            },
        });
        return { res, method: 'get' };
    } else {
        return { res: [], method: 'get' };
    }
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
        topic,
        date: new Date(`${mm}-${dd}-${yyyy}`),
        kode: courseId[0],
        jenis: type,
        isFinished: false,
    });

    console.log(topic);
    return { res: tasks, method: 'add' };
};

export const task = async (req, res) => {
    let tasks;
    const { content } = req.body;
    const userId = req.user._id;

    await postChatFromUser(req);
    try {
        if (isTaskBetween(content)) {
            tasks = await getTasksBetween(userId, content);
        } else if (isTaskAhead(content)) {
            tasks = await getTaskAhead(userId, content);
        } else if (isAllTaskQuestion(content)) {
            tasks = await getAllTask(userId);
        } else if (isAddTask(content)) {
            tasks = await addTask(content, userId);
        } else throw new Error('Bad request');

        const chat = await postChatFromBot(userId, tasks, 'post');

        res.status(200).json({
            status: 'Success',
            data: tasks,
        });
    } catch (err) {
        const chat = await postChatFromBot(userId, false, 'post');
        res.status(400).json({
            status: 'Failed',
            data: err.message,
        });
    }
};
