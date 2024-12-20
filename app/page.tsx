'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
    const [roomId, setRoomId] = useState('')
    const router = useRouter()

    const handleJoinRoom = () => {
        if (roomId) {
            router.push(`/room/${roomId}`)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Collaborative Editor</h1>
            <div className="flex flex-col items-center space-y-4">
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room number"
                    className="p-2 border rounded w-64"
                />
                <button
                    onClick={handleJoinRoom}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Join Room
                </button>
            </div>
        </main>
    )
}

