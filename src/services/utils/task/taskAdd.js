import { Task } from '../../../models/Task';
import { getKodeMatkul, getDate, getKeyword } from '../../../helper/string_matching';
import KMP from '../../../helper/kmp';

export const addTask = async (question, userId) => {
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

    return { res: [tasks], method: 'post' };
};

export const isAddTask = question => getKodeMatkul(question) && getDate(question) && getKeyword(question);
