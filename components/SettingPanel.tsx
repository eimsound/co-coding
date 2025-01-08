import { Select, Card } from 'react-daisyui'
import React from 'react'
import { create } from 'zustand'
interface Settings {
    language: string
    theme: string
}

interface SettingsStore {
    settings: Settings
    setSettings: (settings: Settings) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: { language: 'javascript', theme: 'light' },
    setSettings: (newSettings) => set({ settings: newSettings }),
}))

interface SettingPanelProps {
    onSettingChange?: (settings: Settings) => void
}

export default function SettingPanel({
    onSettingChange = () => {},
}: SettingPanelProps) {
    const { settings, setSettings } = useSettingsStore()

    const handleSettingChange = (key: 'language' | 'theme', value: string) => {
        const newSettings = { ...settings, [key]: value }
        setSettings(newSettings)
        onSettingChange(newSettings)
    }

    return (
        <div>
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
                    <Select.Option value="javascript">JavaScript</Select.Option>
                    <Select.Option value="typescript">TypeScript</Select.Option>
                    <Select.Option value="python">Python</Select.Option>
                    <Select.Option value="java">Java</Select.Option>
                </Select>
            </div>
        </div>
    )
}
