import { Task } from '../../../models/Task';
import { getNDate } from '../../../helper/string_matching';

export const getTaskAhead = async (str, userId) => {
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

export const isTaskAhead = question => getNDate(question);
