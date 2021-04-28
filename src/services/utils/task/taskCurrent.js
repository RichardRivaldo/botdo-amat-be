import { Task } from '../../../models/Task';
import KMP from '../../../helper/kmp';

export const getCurrentTask = async userId => {
    const res = await Task.find({
        userId,
        isFinished: false,
        date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
    });

    return { res, method: 'get' };
};

export const isCurrentTaskQuestion = question => {
    const questionPattern = ['hari ini'];
    for (let i = 0; i < questionPattern.length; i++) {
        if (KMP(question, questionPattern[i]).length) return true;
    }
    return false;
};
