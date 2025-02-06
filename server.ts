import { createServer, IncomingMessage, ServerResponse } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()

const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://co-coding-c6wn.vercel.app',
]

const host = process.env.BACKEND_HOST || 'localhost'
const port = process.env.BACKEND_PORT
    ? parseInt(process.env.BACKEND_PORT)
    : 3001

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const origin = req.headers.origin

    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('OK')
        return
    }

    if (origin && allowedOrigins.indexOf(origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    } else {
        res.writeHead(403, { 'Content-Type': 'text/plain' })
        res.end('Not allowed by CORS')
        return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
})

// ws

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
})

interface Settings {
    switchTrigger: string
    cursorAtEnd: boolean
}

interface Room {
    users: number[]
    maxUsers: number
    content: string
    editingUser: number | null
    lastEditPosition: number
    settings: Settings
    lastSwitchTime: number
}

const rooms = new Map<string, Room>()

export function arrNext<T>(arr: T[], current: T): T {
    // 获取当前元素的索引
    const currentIndex = arr.indexOf(current)

    // 如果元素不在数组中,返回数组第一个元素
    if (currentIndex === -1) {
        return arr[0]
    }

    // 如果是最后一个元素,返回第一个元素
    if (currentIndex === arr.length - 1) {
        return arr[0]
    }

    // 返回下一个元素
    return arr[currentIndex + 1]
}

io.on('connection', (socket) => {
    let currentRoom: string | null = null
    let userId: number | null = null

    socket.on('joinRoom', (roomId: string) => {
        console.log('joinRoom', roomId)
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                users: [],
                maxUsers: 999,
                content: '',
                editingUser: 1,
                lastEditPosition: 0,
                settings: {
                    switchTrigger: '[ \n]',
                    cursorAtEnd: true,
                },
                lastSwitchTime: Date.now(), // 初始化切换时间戳
            })
        }

        const room = rooms.get(roomId)!

        if (room.users.length < room.maxUsers) {
            if (room.users.length === 0) {
                userId = 1
                room.editingUser = 1
            } else {
                userId = room.users[room.users.length - 1] + 1
            }

            room.users.push(userId)
            socket.join(roomId)
            currentRoom = roomId
            socket.emit('userId', userId)
            socket.emit('initialContent', room.content)
            io.to(roomId).emit('setEditingUser', room.editingUser)
        } else {
            socket.emit('roomFull')
        }
    })

    socket.on(
        'contentChange',
        ({ roomId, content, cursorPosition, newChar }) => {
            const room = rooms.get(roomId)
            if (room && room.editingUser === userId) {
                room.content = content
                socket.to(roomId).emit('contentChange', content)

                const now = Date.now()
                // 确保距离上次切换至少200毫秒
                if (
                    newChar &&
                    now - room.lastSwitchTime >= 200 &&
                    new RegExp(room.settings.switchTrigger).test(newChar)
                ) {
                    room.lastSwitchTime = now // 更新切换时间戳
                    room.editingUser = arrNext(room.users, userId)
                    io.to(roomId).emit('setEditingUser', room.editingUser)
                }
            }
        },
    )

    socket.on('requestEditPermission', (roomId) => {
        const room = rooms.get(roomId)
        if (room && room.editingUser !== userId) {
            room.editingUser = userId
            room.lastEditPosition = room.content.length
            io.to(roomId).emit('setEditingUser', userId)
        }
    })

    socket.on('disconnect', () => {
        if (currentRoom) {
            const room = rooms.get(currentRoom)
            if (room) {
                const nextUser = arrNext(room.users, userId)
                room.users = room.users.filter((i) => i !== userId)
                if (room.users.length === 0) {
                    rooms.delete(currentRoom)
                    socket.leave(currentRoom)
                } else {
                    room.editingUser = nextUser
                    room.lastEditPosition = 0
                    io.to(currentRoom).emit('setEditingUser', nextUser)
                }
            }
        }
    })
})

server.listen(port, host, () => {
    console.log(`> Backend ready on http://${host}:${port}`)
})
