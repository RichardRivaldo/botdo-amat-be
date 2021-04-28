import { Task } from '../../../models/Task';
import { getKodeMatkul, getKeyword } from '../../../helper/string_matching';
import KMP from '../../../helper/kmp';

export const getDeadlineFromTask = async (question, userId) => {
    const data = await Task.find({
        userId,
        isFinished: false,
        kode: getKodeMatkul(question)[0],
        jenis: getKeyword(question),
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    return { res: data, method: 'get-date' };
};

export const isDeadlineFromTask = question => {
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
