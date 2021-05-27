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
const io: Server = require('socket.io')(server);
const botName = 'ChatCord Bot';

let users: any[] = [];

function formatMessage(username: string, text: string) {
    return {
        username,
        text,
        time: Date.now()
    };
}

// Join user to chat
function userJoin(id: string, username: string, room: string) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id: string) {
    return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id: string) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room: string) {
    return users.filter((user) => user.room === room);
}

// Run when client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('new_message', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});
export default io;
