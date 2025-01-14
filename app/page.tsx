'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SettingDialog } from '@/components/SettingDialog'
import { Button, Input } from 'react-daisyui'

export default function Home() {
    const [roomId, setRoomId] = useState('')
    const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false)
    const [isJoining, setIsJoining] = useState(false)
    const router = useRouter()

    const handleJoinRoom = () => {
        if (roomId) {
            router.push(`/room/${roomId}`)
            setIsJoining(true)
        }
    }

    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24'>
            <div className='flex flex-col items-center space-y-6'>
                <h1 className='text-4xl font-bold'>co-coding</h1>
                <Input
                    type='text'
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder='Enter room id'
                    className='w-64'
                />
                <div className='flex space-x-4'>
                    <Button onClick={() => setIsSettingDialogOpen(true)}>
                        Settings
                    </Button>
                    <Button
                        onClick={handleJoinRoom}
                        className='btn-primary'
                        loading={isJoining}
                    >
                        Join Room
                    </Button>
                </div>
            </div>
            <SettingDialog
                isOpen={isSettingDialogOpen}
                onClose={() => setIsSettingDialogOpen(false)}
            />
        </main>
    )
}
