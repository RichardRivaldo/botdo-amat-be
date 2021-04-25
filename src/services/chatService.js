import { Chat } from '../models/Chat';

export const getAllChat = async (req, res) => {
    try {
        let chats = await Chat.find();
        res.send(chats);
    } catch (err) {
        res.send({ msg: err });
    }
};
