"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import CodeMirror, { keymap } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
// import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { python } from "@codemirror/legacy-modes/mode/python";
import {
    c,
    cpp,
    csharp,
    dart,
    kotlin,
    java,
    scala,
} from "@codemirror/legacy-modes/mode/clike";
import {
    javascript,
    typescript,
} from "@codemirror/legacy-modes/mode/javascript";
import { php } from "@codemirror/lang-php";
import { go } from "@codemirror/legacy-modes/mode/go";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { rust } from "@codemirror/legacy-modes/mode/rust";
import { erlang } from "@codemirror/legacy-modes/mode/erlang";
import { swift } from "@codemirror/legacy-modes/mode/swift";
import { scheme } from "@codemirror/legacy-modes/mode/scheme";
import { elixir } from "codemirror-lang-elixir";

interface CollaborativeEditorProps {
    roomId: string | undefined;
}

const languages = [
    { name: "Python", extension: () => StreamLanguage.define(python) },
    { name: "C#", extension: () => StreamLanguage.define(csharp) },
    { name: "C++", extension: () => StreamLanguage.define(cpp) },
    { name: "C", extension: () => StreamLanguage.define(c) },
    { name: "JavaScript", extension: () => StreamLanguage.define(javascript) },
    { name: "TypeScript", extension: () => StreamLanguage.define(typescript) },
    { name: "Kotlin", extension: () => StreamLanguage.define(kotlin) },
    { name: "Java", extension: () => StreamLanguage.define(java) },
    { name: "PHP", extension: () => php() },
    { name: "Swift", extension: () => StreamLanguage.define(swift) },
    { name: "Dart", extension: () => StreamLanguage.define(dart) },
    { name: "Go", extension: () => StreamLanguage.define(go) },
    { name: "Ruby", extension: () => StreamLanguage.define(ruby) },
    { name: "Scala", extension: () => StreamLanguage.define(scala) },
    { name: "Rust", extension: () => StreamLanguage.define(rust) },
    { name: "Racket", extension: () => StreamLanguage.define(scheme) },
    { name: "Erlang", extension: () => StreamLanguage.define(erlang) },
    { name: "Elixir", extension: () => elixir() },
];

export default function CollaborativeEditor({
    roomId,
}: CollaborativeEditorProps) {
    const [editorContent, setEditorContent] = useState("");
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<number | null>(null);
    const [isJoined, setIsJoined] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!roomId) {
            setError("Invalid room ID");
            return;
        }

        socketRef.current = io();

        socketRef.current.on("connect", () => {
            console.log("Connected to server");
            socketRef.current?.emit("joinRoom", roomId);
        });

        socketRef.current.on("userId", (id: number) => {
            setUserId(id);
            setIsJoined(true);
        });

        socketRef.current.on("roomFull", () => {
            setError("Room is full. Please try another room.");
        });

        socketRef.current.on("initialContent", (content: string) => {
            setEditorContent(content);
        });

        socketRef.current.on("contentChange", (newContent: string) => {
            setEditorContent(newContent);
        });

        socketRef.current.on("setEditingUser", (editingUserId: number) => {
            setEditingUser(editingUserId);
            setIsReadOnly(editingUserId !== userId);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [roomId, userId]);

    const handleEditorChange = (value: string) => {
        if (roomId && !isReadOnly) {
            setEditorContent(value);
            const lastChar = value.slice(-1);
            socketRef.current?.emit("contentChange", {
                roomId,
                content: value,
                lastChar,
            });
        }
    };

    const requestEditPermission = () => {
        if (roomId) {
            socketRef.current?.emit("requestEditPermission", roomId);
        }
    };

    if (!roomId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-red-500">Invalid room ID</p>
            </div>
        );
    }

    if (!isJoined) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl">Joining room {roomId}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    const customKeymap = keymap.of([
        {
            key: "Ctrl-c",
            run: (view) => {
                const selection = view.state.selection.main;
                const text = view.state.doc.sliceString(
                    selection.from,
                    selection.to,
                );
                navigator.clipboard.writeText(text);
                return true;
            },
        },
        {
            key: "Cmd-c",
            run: (view) => {
                const selection = view.state.selection.main;
                const text = view.state.doc.sliceString(
                    selection.from,
                    selection.to,
                );
                navigator.clipboard.writeText(text);
                return true;
            },
        },
        {
            key: "Enter",
            run: (view) => {
                if (roomId && !isReadOnly) {
                    socketRef.current?.emit("requestEditPermission", roomId);
                }
                return true;
            },
        },
    ]);

    return (
        <div className="w-full h-[600px]">
            <div className="mb-4">
                <select
                    value={selectedLanguage.name}
                    onChange={(e) =>
                        setSelectedLanguage(
                            languages.find(
                                (lang) => lang.name === e.target.value,
                            ) || languages[0],
                        )
                    }
                    className="px-4 py-2 border rounded"
                >
                    {languages.map((lang) => (
                        <option key={lang.name} value={lang.name}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
            <CodeMirror
                value={editorContent}
                height="100%"
                // theme={vscodeDark}
                extensions={[selectedLanguage.extension(), customKeymap]}
                onChange={handleEditorChange}
                editable={!isReadOnly}
                basicSetup={{
                    history: false,
                    drawSelection: false,
                    defaultKeymap: false,
                    historyKeymap: false,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    closeBrackets: false,
                    autocompletion: false,
                    rectangularSelection: false,
                    crosshairCursor: false,
                    highlightSelectionMatches: false,
                    closeBracketsKeymap: false,
                    searchKeymap: false,
                    foldKeymap: false,
                    lintKeymap: false,
                    tabSize: 4,
                }}
            />
            <div className="mt-4 flex justify-between items-center">
                <p>
                    You are User {userId} in Room {roomId}.
                    {isReadOnly
                        ? `User ${editingUser} is currently editing.`
                        : "You can edit now. Press Enter to switch control."}
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
    );
}
