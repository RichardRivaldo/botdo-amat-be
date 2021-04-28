import { Task } from '../../../models/Task';
import KMP from '../../../helper/kmp';

export const getAllTask = async userId => {
    const res = await Task.find({
        userId,
        isFinished: false,
        date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    return { res, method: 'get' };
};

export const isAllTaskQuestion = question => {
    const questionPattern = ['sejauh ini', 'semua', 'seluruh'];
    for (let i = 0; i < questionPattern.length; i++) {
        if (KMP(question, questionPattern[i]).length) return true;
    }
    return false;
};
