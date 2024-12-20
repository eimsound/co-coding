import { createServer } from 'http'
import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'

const port = process.env.PORT || 3001
const app = express()
const server = createServer(app)

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
}))

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const rooms = new Map<string, {
    users: Set<string>,
    content: string,
    editingUser: number | null,
    charArray: string[],
    blockArray: string[]
}>()

io.on('connection', (socket) => {
    let currentRoom: string | null = null
    let userId: number | null = null

    socket.on('joinRoom', (roomId: string) => {
        if (!rooms.has(roomId)) {
            rooms.set(roomId, { users: new Set(), content: '', editingUser: null, charArray: [], blockArray: ['\n'] })
        }

        const room = rooms.get(roomId)!

        if (room.users.size < 2) {
            room.users.add(socket.id)
            socket.join(roomId)
            currentRoom = roomId
            userId = room.users.size
            socket.emit('userId', userId)
            socket.emit('initialContent', room.content)

            if (room.users.size === 1) {
                room.editingUser = 1
                io.to(roomId).emit('setEditingUser', 1)
            } else {
                io.to(roomId).emit('setEditingUser', room.editingUser)
            }
        } else {
            socket.emit('roomFull')
        }
    })

    socket.on('contentChange', ({ roomId, content, lastChar }) => {
        const room = rooms.get(roomId)
        if (room && room.editingUser === userId) {
            room.content = content
            room.charArray.push(lastChar)
            socket.to(roomId).emit('contentChange', content)
            if (room.blockArray.includes(lastChar)) {
                room.editingUser = userId === 1 ? 2 : 1
                room.charArray = []
                io.to(roomId).emit('setEditingUser', room.editingUser)
            }
        }
    })

    socket.on('requestEditPermission', (roomId) => {
        const room = rooms.get(roomId)
        if (room && room.editingUser !== userId && room.charArray.length === 0) {
            room.editingUser = userId
            io.to(roomId).emit('setEditingUser', userId)
        }
    })

    socket.on('disconnect', () => {
        if (currentRoom) {
            const room = rooms.get(currentRoom)
            if (room) {
                room.users.delete(socket.id)
                if (room.users.size === 0) {
                    rooms.delete(currentRoom)
                } else {
                    room.editingUser = 1
                    room.charArray = []
                    io.to(currentRoom).emit('setEditingUser', 1)
                }
            }
        }
    })
})

// 添加一个简单的健康检查路由
app.get('/health', (req, res) => {
    res.status(200).send('OK')
})

server.listen(port, () => {
    console.log(`> Backend ready on http://localhost:${port}`)
})

