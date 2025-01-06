'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SettingPanel from '@/components/SettingPanel'

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
            <h1 className="text-4xl font-bold mb-8">co-coding</h1>
            <div className="flex flex-col items-center space-y-4">
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room id"
                    className="input input-bordered w-64"
                />
                <SettingPanel />
                <button onClick={handleJoinRoom} className="btn btn-primary">
                    Join Room
                </button>
            </div>
        </main>
    )
}
