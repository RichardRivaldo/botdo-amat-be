import { Task } from '../models/Task';
import {
    getKodeMatkul,
    getDate,
    getKeyword,
    getID,
    normalizeDate,
    get2Date,
    getNDate,
} from '../helper/string_matching';
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

const isTaskBetween = question => {
    return get2Date(question);
};

const isTaskAhead = question => {
    return getNDate(question);
};

const isSpecialTaskAhead = question => {
    return isTaskAhead(question) && getKeyword(question);
}

const getTasksBetween = async (str, userId) => {
    if (get2Date(str)) {
        try{
            console.log("INI DI DALEM TRY")
            let { date1, date2 } = get2Date(str);

            const res = await Task.find({
                //query today up to tonight
                userId,
                date: {
                    $gte: new Date(date1.setHours(0, 0, 0, 0)),
                    $lt: new Date(date2.setHours(23, 59, 59, 999)),
                },
            });
            return { res, method: 'get' };
        }catch(error){
            return {res : false, method: 'get'};
        }
        
    } else {
        return { res: [], method: 'get' };
    }
};

const getTaskAhead = async (str, userId) => {
    const temp = getNDate(str);
    if (temp) {
        const { date1, date2 } = temp;
        try {
            const res = await Task.find({
                //query today up to tonight
                userId,
                date: {
                    $gte: new Date(date1),
                    $lt: new Date(date2),
                },
            });
            return { res, method: 'get' };
        } catch (error) {
            return { res: [], method: 'get' };
        }
    } else {
        return { res: [], method: 'get' };
    }
};

const getSpecialTaskAhead = async (question, userId) => {
    console.log("BERHASIL MASUK GET SPECIAL TASK AHEAD");
    const temp = getNDate(question);
    const jenis = getKeyword(question);
    console.log(temp);
    console.log("INI JENIS!!!!!!!!!!!!!!!!!");
    console.log(jenis);
    if (temp) {
        const { date1, date2 } = temp;
        try {
            const res = await Task.find({
                //query today up to tonight
                userId,
                jenis,
                date: {
                    $gte: new Date(date1),
                    $lt: new Date(date2),
                },
            });
            return { res, method: 'get' };
        } catch (error) {
            return { res: [], method: 'get' };
        }
    } else {
        return { res: [], method: 'get' };
    }
};

const getAllTask = async userId => {
    const res = await Task.find({ userId, isFinished: false, date: { $gte: Date.now() } });
    console.log(res);
    return { res, method: 'get' }
};

// Get current task
const isCurrentTaskQuestion = question => {
    console.log("IS CURRENT TASK QUESTION");
    const questionPattern = ['hari ini'];
    for (let i = 0; i < questionPattern.length; i++) {
        if (KMP(question, questionPattern[i]).length) return true;
    }
    return false;
};
const getCurrentTask = async userId => {
    const res = await Task.find({
        userId,
        isFinished: false,
        date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
    });

    return { res, method: 'get' };
}

// Get deadline task
const isDeadlineFromTask = question => {
    const questionPattern = ['kapan', 'tanggal berapa'];
    let flag = false;

    for (let i = 0; i < questionPattern.length; i++) {
        if (KMP(question, questionPattern[i]).length) {
            flag = true;
            break;
        }
    }

    return flag && getKodeMatkul(question) && getKeyword(question);
};
const getDeadlineFromTask = async (question, userId) => {
    const data = await Task.find({
        userId,
        isFinished: false,
        kode: getKodeMatkul(question)[0],
        jenis: getKeyword(question),
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    return { res : data, method: 'get'}
}



// Add Task
const isAddTask = question => getKodeMatkul(question) && getDate(question) && getKeyword(question);

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

    if (topic.length == 0) throw new Error('Bad request');

    const tasks = await Task.create({
        userId,
        topic,
        date: new Date(`${mm}-${dd}-${yyyy}`),
        kode: courseId[0],
        jenis: type,
        isFinished: false,
    });

    return { res : [tasks], method: 'post' };
};

export const task = async (req, res) => {
    let tasks;
    const { content } = req.body;
    const userId = req.user._id;

    await postChatFromUser(req);
    try {
        // Add task
        console.log("MASUK TRY");
        if (isAddTask(content)) {
            console.log("BAMBANG");
            tasks = await addTask(content, userId);
        } else if (KMP(content, 'deadline').length) {
            console.log("MASUK SINI BANG");
            if (isTaskBetween(content)){
                console.log("MASUK 1");
                tasks = await getTasksBetween(content, userId);
            }else if(isSpecialTaskAhead(content)){
                console.log('MASUK 2a');
                tasks = await getSpecialTaskAhead(content, userId);
            }
            else if(isTaskAhead(content)) {
                console.log("MASUK 2");
                tasks = await getTaskAhead(content, userId);
            }
            else if (isCurrentTaskQuestion(content)){
                console.log("MASUK 3");
                tasks = await getCurrentTask(userId); 
            }else if (isDeadlineFromTask(content)) {
                tasks = await getDeadlineFromTask(content, userId);
            }else if (isAllTaskQuestion(content)){
                console.log("MASUK 4");
                tasks = await getAllTask(userId);
            }
            else {
                console.log("Masuk 5");
                throw new Error('Bad request');
            }
        } else if (isFinishTask(content)) {
            console.log("MASUK 6");
            tasks = await finishTask(content, userId);
        } else if (isUpdateTask(content)) {
            console.log("MASUK 7");
            tasks = await updateTask(content, userId);
        } else {
            throw new Error('Bad request');
        }

        await postChatFromBot(userId, tasks);

        res.status(200).json({
            status: 'Success',
            data: tasks,
        });
    } catch (err) {
        await postChatFromBot(userId, false, 'post');

        console.log(err);

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
    const id = Number(getID(question));
    const filter = { userId : userId, _id : id };
    const finish = { isFinished : true };

    let finished = await Task.findOneAndUpdate(filter, finish, { new: true });

    if(!finished) return { res: [], method: 'post', msg: "ID Task tidak ditemukan!" };
    else return { res : [finished], method: 'post', msg: `Berhasil menyelesaikan Task dengan ID ${id}!`};
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
    const id = Number(getID(question));
    let newDate = getDate(question);
    newDate = normalizeDate(newDate);
    const filter = { userId : userId, _id : id };
    const update = { date : newDate };

    let updated = await Task.findOneAndUpdate(filter, update, { new : true });

    if(!updated) return { res: [], method: 'post', msg:"ID Task tidak ditemukan!"};
    else return { res : [updated], method: 'post', msg:`Berhasil memperbarui Task dengan ID ${id}!`};
}