import { Task } from '../../../models/Task';
import { get2Date } from '../../../helper/string_matching';

export const getTasksBetween = async (str, userId) => {
    if (get2Date(str)) {
        try {
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
        } catch (error) {
            return { res: false, method: 'get' };
        }
    } else {
        return { res: [], method: 'get' };
    }
};

export const isTaskBetween = question => get2Date(question);
