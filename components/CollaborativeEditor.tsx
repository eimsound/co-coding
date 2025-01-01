'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import MonacoEditor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import SettingsModal from './SettingsModal'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

interface CollaborativeEditorProps {
    roomId: string | undefined
}

interface Settings {
    switchTrigger: string;
    cursorAtEnd: boolean;
}

export default function CollaborativeEditor({ roomId }: CollaborativeEditorProps) {
    const [editorContent, setEditorContent] = useState('')
    const [isReadOnly, setIsReadOnly] = useState(true)
    const [userId, setUserId] = useState<number | null>(null)
    const [editingUser, setEditingUser] = useState<number | null>(null)
    const [isJoined, setIsJoined] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [settings, setSettings] = useState<Settings>({
        switchTrigger: '\n',
        cursorAtEnd: false
    })
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const socketRef = useRef<Socket | null>(null)
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        const savedSettings = localStorage.getItem('editorSettings')
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
        }
    }, [])

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

    useEffect(() => {
        if (editorRef.current) {
            const editor = editorRef.current;
            if (settings.cursorAtEnd) {
                editor.onDidChangeCursorPosition((e) => {
                    const lastLine = editor.getModel()?.getLineCount() || 1;
                    const lastColumn = editor.getModel()?.getLineMaxColumn(lastLine) || 1;
                    if (e.position.lineNumber !== lastLine || e.position.column !== lastColumn) {
                        editor.setPosition({ lineNumber: lastLine, column: lastColumn });
                    }
                });
            } else {
                // Remove the cursor position listener if cursorAtEnd is false
                //editor.dispose(); //This line causes an error.  The editor is already disposed of by react.
            }
        }
    }, [settings.cursorAtEnd]);


    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined && roomId && !isReadOnly) {
            setEditorContent(value)
            const cursorPosition = editorRef.current?.getPosition()
            socketRef.current?.emit('contentChange', {
                roomId,
                content: value,
                cursorPosition: cursorPosition ? cursorPosition.column + (cursorPosition.lineNumber - 1) * 1000 : 0,
                settings
            })
        }
    }

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor
        if (settings.cursorAtEnd) {
            editor.onDidChangeCursorPosition((e) => {
                const lastLine = editor.getModel()?.getLineCount() || 1
                const lastColumn = editor.getModel()?.getLineMaxColumn(lastLine) || 1
                if (e.position.lineNumber !== lastLine || e.position.column !== lastColumn) {
                    editor.setPosition({ lineNumber: lastLine, column: lastColumn })
                }
            })
        }
    }

    const requestEditPermission = () => {
        if (roomId) {
            socketRef.current?.emit('requestEditPermission', roomId)
        }
    }

    const handleSettingsSave = (newSettings: Settings) => {
        setSettings(newSettings)
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
                language="python"
                theme="vs-dark"
                value={editorContent}
                onChange={handleEditorChange}
                options={{
                    readOnly: isReadOnly,
                    wordWrap: 'on',
                    minimap: { enabled: false }
                }}
                onMount={handleEditorDidMount}
            />
            <div className="mt-4 flex justify-between items-center">
                <p>
                    You are User {userId} in Room {roomId}.
                    {isReadOnly
                        ? `User ${editingUser} is currently editing.`
                        : 'You can edit now.'}
                </p>
                {isReadOnly && (
                    <button
                        onClick={requestEditPermission}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Request Edit Permission
                    </button>
                )}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Settings
                </button>
            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSettingsSave}
            />
        </div>
    )
}

