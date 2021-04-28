import { Chat } from '../models/Chat';

export const getAllChat = async (req, res) => {
    const userId = req.user._id;
    try {
        let chats = await Chat.find({ user: userId });
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
    const { method, msg, res } = obj;
    let content = '';

    if (obj == false) {
        content = 'Maaf! Terjadi kesalahan! Pesan tidak dikenali atau ada masalah pada server!';
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
                content = isNull
                    ? '[Task tidak ditemukan sebagai task yang belum selesai]'
                    : '[Task berhasil diperbaharui!]';
                break;
            case 'get-date':
                content = isNull ? '[Task tidak ditemukan]' : '[Berikut deadline task anda]';
        }
    }

    content += msg || '';

    if (res && method != 'get-date') {
        res.map(row => {
            content += `<br/>(ID: ${row._id}) ${row.date.getDate()}/${row.date.getMonth() +
                1}/${row.date.getFullYear()}`;
            content += ` - ${row.jenis} - ${row.kode} - ${row.topic} - `;
            content += row.isFinished ? 'Sudah selesai<br/>' : 'Belum selesai<br/>';
        });
    } else if (res) {
        res.map(row => {
            content += `<br/>(ID: ${row._id}) ${row.date.getDate()}/${row.date.getMonth() +
                1}/${row.date.getFullYear()}<br/>`;
        });
    }

    let chat = await new Chat({ content, user, isRobot: true });
    await chat.save();

    return chat;
};

export const getLastBotChat = async (req, res) => {
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
};
