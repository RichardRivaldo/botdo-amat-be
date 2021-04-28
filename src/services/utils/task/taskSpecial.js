import { Task } from '../../../models/Task';
import { getNDate, getKeyword } from '../../../helper/string_matching';
import { isTaskAhead } from './taskAhead';

export const getSpecialTaskAhead = async (question, userId) => {
    const temp = getNDate(question);
    const jenis = getKeyword(question);
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

export const isSpecialTaskAhead = question => isTaskAhead(question) && getKeyword(question);
