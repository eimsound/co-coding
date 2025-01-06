import { Select, Card } from 'react-daisyui'
import React from 'react'
import { create } from 'zustand'

interface Settings {
    language: string
    theme: string
}

interface SettingsStore {
    settings: Settings
    updateSettings: (settings: Settings) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: { language: 'javascript', theme: 'light' },
    updateSettings: (newSettings) => set({ settings: newSettings }),
}))

interface SettingPanelProps {
    onSettingChange?: (settings: Settings) => void
}

export default function SettingPanel({
    onSettingChange = () => {},
}: SettingPanelProps) {
    const { settings, updateSettings } = useSettingsStore()

    const handleSettingChange = (key: 'language' | 'theme', value: string) => {
        const newSettings = { ...settings, [key]: value }
        updateSettings(newSettings)
        onSettingChange(newSettings)
    }

    return (
        <Card className="bg-base-200 shadow-xl p-6">
            <Card.Body className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">编程语言</span>
                    </label>
                    <Select
                        value={settings.language}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleSettingChange('language', e.target.value)
                        }
                        className="w-full max-w-xs"
                    >
                        <Select.Option value="javascript">
                            JavaScript
                        </Select.Option>
                        <Select.Option value="typescript">
                            TypeScript
                        </Select.Option>
                        <Select.Option value="python">Python</Select.Option>
                        <Select.Option value="java">Java</Select.Option>
                    </Select>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">主题</span>
                    </label>
                    <Select
                        value={settings.theme}
                        onChange={(e) =>
                            handleSettingChange('theme', e.target.value)
                        }
                        className="w-full max-w-xs"
                    >
                        <Select.Option value="light">Light</Select.Option>
                        <Select.Option value="dark">Dark</Select.Option>
                        <Select.Option value="cupcake">Cupcake</Select.Option>
                        <Select.Option value="dracula">Dracula</Select.Option>
                        <Select.Option value="night">Night</Select.Option>
                        <Select.Option value="coffee">Coffee</Select.Option>
                    </Select>
                </div>
            </Card.Body>
        </Card>
    )
}
