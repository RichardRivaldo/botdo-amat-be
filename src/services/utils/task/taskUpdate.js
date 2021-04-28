import { Task } from '../../../models/Task';
import { getID, getDate, normalizeDate } from '../../../helper/string_matching';
import KMP from '../../../helper/kmp';

export const updateTask = async (question, userId) => {
    const id = Number(getID(question));
    let newDate = getDate(question);
    newDate = normalizeDate(newDate);
    const filter = { userId: userId, _id: id };
    const update = { date: newDate };

    let updated = await Task.findOneAndUpdate(filter, update, { new: true });

    if (!updated) return { res: [], method: 'post', msg: 'ID Task tidak ditemukan!' };
    else return { res: [updated], method: 'post', msg: `Berhasil memperbarui Task dengan ID ${id}!` };
};

export const isUpdateTask = question => {
    const id = getID(question);
    const newDate = getDate(question);
    const pattern = ['diundur', 'diubah', 'dimajukan', 'update', 'ubah'];

    for (let i = 0; i < pattern.length; i++) {
        if (KMP(question, pattern[i]).length) return true && id != null && newDate != null;
    }

    return false;
};
