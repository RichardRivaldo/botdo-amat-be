import { Task } from '../../../models/Task';
import { getID } from '../../../helper/string_matching';
import KMP from '../../../helper/kmp';

export const finishTask = async (question, userId) => {
    const id = Number(getID(question));
    const filter = { userId: userId, _id: id };
    const finish = { isFinished: true };

    let finished = await Task.findOneAndUpdate(filter, finish, { new: true });

    if (!finished) return { res: [], method: 'post', msg: 'ID Task tidak ditemukan!' };
    else return { res: [finished], method: 'post', msg: `Berhasil menyelesaikan Task dengan ID ${id}!` };
};

export const isFinishTask = question => {
    const id = getID(question);
    const pattern = ['selesai', 'sudah', 'finish'];

    for (let i = 0; i < pattern.length; i++) {
        if (KMP(question, pattern[i]).length) return true && id != null;
    }

    return false;
};
