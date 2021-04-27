import { Task } from '../models/Task';
import { getKodeMatkul, getDate, getKeyword, getID } from '../helper/string_matching';
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
const getAllTask = async userId => ({ res: await Task.find({ userId }), method: 'get' });

// Add Task
const isAddTask = question => {
    const courseId = getKodeMatkul(question);
    const date = getDate(question);
    const type = getKeyword(question);

    console.log('INI DARI ADD TASK');
    console.log(courseId && date && type);

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
        console.log('MASUK SINI BANG');
        if (isAllTaskQuestion(content)) {
            console.log('MASUK SINI');
            tasks = await getAllTask(userId);
        } else if (isAddTask(content)) {
            console.log('KOK SINI');
            tasks = await addTask(content, userId);
        } else if(isFinishTask(content)){
            tasks = await finishTask(content, userId);
        } else if(isUpdateTask(content)){
            tasks = await updateTask(content, userId);
        }
        else throw new Error('Bad request');

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

// Finish Task
const isFinishTask = question => {
    const id = getID(question);
    const pattern = ['selesai', 'sudah', 'finish'];
    for(let i = 0; i < pattern.length; i++){
        if(KMP(question, pattern[i]).length) return true && id != null;
    }
    return false;
}

const finishTask = async (question, userId) => {
    const id = getID(question);
    const filter = { userId : userId, _id : id };
    const finish = { isFinished : true };

    let finished = await Task.findOneAndUpdate(filter, finish);

    if(finished.length == 0) return "ID Task tidak ditemukan!";
    else return "Berhasil menyelesaikan Task dengan ID ${id}!";
}

// Update Task
const isUpdateTask = question => {
    const id = getID(question);
    const newDate = getDate(question);
    const pattern = ['diundur', 'diubah', 'dimajukan', 'update'];
    for(let i = 0; i < pattern.length; i++){
        if(KMP(question, pattern[i]).length) return true && id != null && newDate != null;
    }
    return false;
}

const updateTask = async (question, userId) => {
    const id = getID(question);
    const newDate = getDate(question);
    const filter = { userId : userId, _id : id };
    const update = { date : newDate };

    let updated = await Task.findOneAndUpdate(filter, update);

    if(updated.length == 0) return "ID Task tidak ditemukan!";
    else return "Berhasil memperbarui Task dengan ID ${id}!";
}