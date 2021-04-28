import KMP from '../helper/kmp';

import { postChatFromUser, postChatFromBot } from './chatService.js';
import { getTasksBetween, isTaskBetween } from './utils/task/taskBetween';
import { getTaskAhead, isTaskAhead } from './utils/task/taskAhead';
import { getSpecialTaskAhead, isSpecialTaskAhead } from './utils/task/taskSpecial';
import { getCurrentTask, isCurrentTaskQuestion } from './utils/task/taskCurrent';
import { getAllTask, isAllTaskQuestion } from './utils/task/taskAll';
import { getDeadlineFromTask, isDeadlineFromTask } from './utils/task/taskDeadline';
import { addTask, isAddTask } from './utils/task/taskAdd';
import { updateTask, isUpdateTask } from './utils/task/taskUpdate';
import { finishTask, isFinishTask } from './utils/task/taskFinish';

export const task = async (req, res) => {
    let tasks;
    const { content } = req.body;
    const userId = req.user._id;

    await postChatFromUser(req);
    try {
        // Add task
        if (isAddTask(content)) {
            tasks = await addTask(content, userId);
        } else if (KMP(content, 'deadline').length) {
            if (isTaskBetween(content)) {
                tasks = await getTasksBetween(content, userId);
            } else if (isSpecialTaskAhead(content)) {
                tasks = await getSpecialTaskAhead(content, userId);
            } else if (isTaskAhead(content)) {
                tasks = await getTaskAhead(content, userId);
            } else if (isCurrentTaskQuestion(content)) {
                tasks = await getCurrentTask(userId);
            } else if (isDeadlineFromTask(content)) {
                tasks = await getDeadlineFromTask(content, userId);
            } else if (isAllTaskQuestion(content)) {
                tasks = await getAllTask(userId);
            } else {
                throw new Error('Bad request');
            }
        } else if (isFinishTask(content)) {
            tasks = await finishTask(content, userId);
        } else if (isUpdateTask(content)) {
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

        res.status(400).json({
            status: 'Failed',
            data: err.message,
        });
    }
};
