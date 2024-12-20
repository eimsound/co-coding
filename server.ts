import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req, res, parsedUrl)
    })

    const io = new Server(server)

    const rooms = new Map<string, {
        users: Set<string>,
        content: string,
        editingUser: number | null,
        charArray: string[]
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

    server.listen(3000, () => {
        console.log('> Ready on http://localhost:3000')
    })
})
