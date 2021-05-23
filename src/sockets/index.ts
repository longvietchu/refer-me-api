import { server } from '../app';
import { Server, Socket } from 'socket.io';

// init socket server
const socketOptions = {
    // server
    path: process.env.SOCKET_PATH,
    origins: '*:*',
    // engine
    transports: ['websocket'],
    cookie: false,
    cookiePath: false
};
const io: Server = require('socket.io')(server, socketOptions);

// 1. Messenger Namespace
// 1.1. Middlewares
// io.use((socket: Socket, next) => {
//     console.log('socket query: ', socket.handshake.query);
//     let { token, user_id, user_role } = socket.handshake.query;

//     // ! TODO(vuong, khanh): check token
//     if (token) {
//         // mark user id and join the own room
//         // socket['user_id'] = user_id;
//         // socket.join(user_id);

//         // // mark user role
//         // socket['user_role'] = user_role;

//         return next();
//     } else {
//         return next(new Error('Authentication Error'));
//     }
// });

// Soketio
let users: any[] = [];
io.on('connection', (socket: Socket) => {
    // console.log(socket.id + ' connected.')

    socket.on('new_message', async (msg) => {
        console.log(msg);
    });

    socket.on('disconnect', () => {
        // console.log(socket.id + ' disconnected.')
        users = users.filter((user) => user.userId !== socket.id);
    });
});
export default io;
