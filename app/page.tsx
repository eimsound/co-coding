'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SettingDialog } from '@/components/SettingDialog'
import { Button, Input } from 'react-daisyui'

export default function Home() {
    const [roomId, setRoomId] = useState('')
    const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false)
    const [isJoining, setIsJoining] = useState(false)
    const [isInputError, setIsInputError] = useState(false)
    const router = useRouter()

    const handleJoinRoom = () => {
        if (roomId && !isInputError) {
            router.push(`/room/${roomId}`)
            setIsJoining(true)
        }
    }
    function isAlphanumeric(str: string): boolean {
        return /^[a-zA-Z0-9]+$/.test(str)
    }

    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24'>
            <div className={`flex flex-col items-center space-y-6 `}>
                <h1 className='text-4xl font-bold'>co-coding</h1>

                <div className='flex w-96 component-preview items-center justify-center gap-2 font-sans p-0'>
                    <div className='form-control w-full max-w-xs'>
                        <Input
                            type='text'
                            value={roomId}
                            onChange={(e) => {
                                setRoomId(e.target.value)
                                setIsInputError(!isAlphanumeric(e.target.value))
                            }}
                            placeholder='Enter room id'
                            className='w-full'
                            color={isInputError ? 'error' : undefined}
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    handleJoinRoom()
                                }
                            }}
                        />
                        {isInputError && (
                            <label className='label pb-0'>
                                <span className='label-text-alt text-error'>
                                    Alphanumeric only
                                </span>
                            </label>
                        )}
                    </div>
                </div>

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
