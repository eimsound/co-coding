import { createServer } from 'http'
import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'

const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000", "https://co-coding-c6wn.vercel.app"];

const port = process.env.PORT || 3001
const app = express()
const server = createServer(app)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST"]
}));

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

interface Room {
    users: Set<string>;
    content: string;
    editingUser: number | null;
    lastEditPosition: number;
}

interface Settings {
    switchTrigger: string;
    cursorAtEnd: boolean;
}

const rooms = new Map<string, Room>();

io.on('connection', (socket) => {
    let currentRoom: string | null = null;
    let userId: number | null = null;

    socket.on('joinRoom', (roomId: string) => {
        if (!rooms.has(roomId)) {
            rooms.set(roomId, { users: new Set(), content: '', editingUser: null, lastEditPosition: 0 });
        }

        const room = rooms.get(roomId)!;

        if (room.users.size < 2) {
            room.users.add(socket.id);
            socket.join(roomId);
            currentRoom = roomId;
            userId = room.users.size;
            socket.emit('userId', userId);
            socket.emit('initialContent', room.content);

            if (room.users.size === 1) {
                room.editingUser = 1;
                io.to(roomId).emit('setEditingUser', 1);
            } else {
                io.to(roomId).emit('setEditingUser', room.editingUser);
            }
        } else {
            socket.emit('roomFull');
        }
    });

    socket.on('contentChange', ({ roomId, content, cursorPosition, settings }: { roomId: string, content: string, cursorPosition: number, settings: Settings }) => {
        const room = rooms.get(roomId);
        if (room && room.editingUser === userId) {
            const oldContent = room.content;
            room.content = content;

            const switchTrigger = settings.switchTrigger || '\n';
            const newContentAfterLastEdit = content.slice(room.lastEditPosition);

            if (newContentAfterLastEdit.includes(switchTrigger)) {
                room.editingUser = userId === 1 ? 2 : 1;
                room.lastEditPosition = content.length;
                io.to(roomId).emit('setEditingUser', room.editingUser);
            } else if (cursorPosition < room.lastEditPosition) {
                room.lastEditPosition = cursorPosition;
            }

            socket.to(roomId).emit('contentChange', content);
        }
    });

    socket.on('requestEditPermission', (roomId) => {
        const room = rooms.get(roomId);
        if (room && room.editingUser !== userId) {
            room.editingUser = userId;
            room.lastEditPosition = room.content.length;
            io.to(roomId).emit('setEditingUser', userId);
        }
    });

    socket.on('disconnect', () => {
        if (currentRoom) {
            const room = rooms.get(currentRoom);
            if (room) {
                room.users.delete(socket.id);
                if (room.users.size === 0) {
                    rooms.delete(currentRoom);
                } else {
                    room.editingUser = 1;
                    room.lastEditPosition = 0;
                    io.to(currentRoom).emit('setEditingUser', 1);
                }
            }
        }
    });
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

server.listen(port, () => {
    console.log(`> Backend ready on http://localhost:${port}`);
});

