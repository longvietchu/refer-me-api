import { server } from '../app';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../models/Message';

const io: Server = require('socket.io')(server);

io.use((socket: any, next) => {
    // console.log('socket query: ', socket.handshake.query);
    let { token, user_id } = socket.handshake.query;
    if (token) {
        // mark user id and join the own room
        socket['user_id'] = user_id;
        socket.join(user_id);
        return next();
    } else {
        // console.log('Socket Authentication Error');
        return next(new Error('Authentication Error'));
    }
});

// Run when client connects
io.on('connection', (socket: Socket) => {
    socket.on('new_message', async (msg: any) => {
        const { room_id, from, to, content } = msg;
        const clientMessage = {
            _id: uuidv4(),
            room_id,
            from,
            to,
            content: content.trim(),
            is_seen: false
        };
        const serverMessage = {
            ...clientMessage,
            created_at: new Date().toISOString()
        };
        io.to(to).emit('new_message', serverMessage);
        io.to(from).emit('new_message', serverMessage);
        await Message.create(clientMessage);
    });

    socket.on('seen_message', async (msg: any) => {
        let { room_id, to, from, last_message_created_at } = msg;
        let findCondition = {
            room_id,
            to,
            created_at: { $lte: last_message_created_at },
            is_seen: false
        };
        io.to(to).emit('seen_message', msg);
        io.to(from).emit('seen_message', msg);
        await Message.updateMany(findCondition, { is_seen: true });
    });

    socket.on('error', (err) => {
        console.log('error from socket: ', socket.id, ' error: ', err);
    });
});
export default io;
