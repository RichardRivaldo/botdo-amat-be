import { Chat } from '../models/Chat';

export const getAllChat = async (req, res) => {
    const userId = req.user._id;
    try {
        let chats = await Chat.find(userId);
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

export const postChatFromBot = async (user, obj) => {
    console.log(obj);
    const { method, msg, res } = obj;
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

    content += msg || '';
    console.log("res",res);
    if  (res)  {
        res.map(row => {
            content += `\n(ID: ${row._id}) ${row.date.getDate()}/${row.date.getMonth() + 1}/${row.date.getFullYear()}`;
            content += ` - ${row.jenis} - ${row.kode} - ${row.topic} - `;
            content += row.isFinished ? 'Sudah selesai\n' : 'Belum selesai\n';
        });
    }   
  
    console.log("INI CONTENT");
    console.log(content);
    let chat = await new Chat({ content, user, isRobot: true });
    await chat.save();
    return chat;
};

export const getLastBotChat = async (req, res) => {
    console.log(req.user);
    try {
        const data = await Chat.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(1);
        res.status(200).json({
            status: 'Success',
            data: data[0],
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            data: err.message,
        });
    }
}