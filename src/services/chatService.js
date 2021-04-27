import { Chat } from '../models/Chat';

export const getAllChat = async (req, res) => {
    try {
        let chats = await Chat.find();
        res.send(chats);
    } catch (err) {
        res.send({ msg: err });
    }
};

export const postChatFromUser = async req => {
    let user = req.user._id;
    let content = req.body.content;
    let chat = await new Chat({ content, user, isRobot: false });
    await chat.save();

    return chat;
};

export const postChatFromBot = async (user, obj, method) => {
    let content = '';
    if (obj == false) {
        content = '[Terjadi kesalahan pada server!]';
    } else {
        let isNull = !Object.keys(obj).length;
        switch (method) {
            case 'post':
                content = isNull ? '[Terjadi kesalahan pada server!]' : '[Task berhasil dibuat!]';
                break;
            case 'get':
                content = isNull ? '[Anda tidak memiliki deadline!]' : '[Daftar deadline anda:]';
                break;
            case 'update':
                content = isNull ? '[Task telah ]' : '[Task berhasil diperbaharui!]';
        }
    }
    let chat = await new Chat({ user, content, isRobot: true });
    console.log(chat);
    await chat.save();
    return chat;
};