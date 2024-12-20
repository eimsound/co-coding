'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import MonacoEditor from '@monaco-editor/react'
import * as monaco from 'monaco-editor';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

interface CollaborativeEditorProps {
    roomId: string | undefined
}

export default function CollaborativeEditor({ roomId }: CollaborativeEditorProps) {
    const [editorContent, setEditorContent] = useState('')
    const [isReadOnly, setIsReadOnly] = useState(true)
    const [userId, setUserId] = useState<number | null>(null)
    const [editingUser, setEditingUser] = useState<number | null>(null)
    const [isJoined, setIsJoined] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const socketRef = useRef<Socket | null>(null)
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (!roomId) {
            setError('Invalid room ID')
            return
        }

        socketRef.current = io(BACKEND_URL)

        socketRef.current.on('connect', () => {
            console.log('Connected to server')
            socketRef.current?.emit('joinRoom', roomId)
        })

        socketRef.current.on('userId', (id: number) => {
            setUserId(id)
            setIsJoined(true)
        })

        socketRef.current.on('roomFull', () => {
            setError('Room is full. Please try another room.')
        })

        socketRef.current.on('initialContent', (content: string) => {
            setEditorContent(content)
        })

        socketRef.current.on('contentChange', (newContent: string) => {
            setEditorContent(newContent)
        })

        socketRef.current.on('setEditingUser', (editingUserId: number) => {
            setEditingUser(editingUserId)
            setIsReadOnly(editingUserId !== userId)
        })

        return () => {
            socketRef.current?.disconnect()
        }
    }, [roomId, userId])

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined && roomId && !isReadOnly) {
            setEditorContent(value)
            const lastChar = value.slice(-1)
            socketRef.current?.emit('contentChange', { roomId, content: value, lastChar })
        }
    }

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    };

    const requestEditPermission = () => {
        if (roomId) {
            socketRef.current?.emit('requestEditPermission', roomId)
        }
    }

    if (!roomId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-red-500">Invalid room ID</p>
            </div>
        )
    }

    if (!isJoined) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl">Joining room {roomId}...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="w-full h-[600px]">
            <MonacoEditor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={editorContent}
                onChange={handleEditorChange}
                options={{ readOnly: isReadOnly }}
                onMount={handleEditorDidMount}
            />
            <div className="mt-4 flex justify-between items-center">
                <p>
                    You are User {userId} in Room {roomId}.
                    {isReadOnly
                        ? `User ${editingUser} is currently editing.`
                        : 'You can edit now. Press Enter to switch control.'}
                </p>
                {isReadOnly && (
                    <button
                        onClick={requestEditPermission}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Request Edit Permission
                    </button>
                )}
            </div>
        </div>
    )
}

