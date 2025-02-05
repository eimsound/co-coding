import { Select } from 'react-daisyui'
import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware' // 引入 persist 中间件
import { languages } from '@/common/lang'

interface Settings {
    language: string
}

interface SettingsStore {
    settings: Settings
    setSettings: (settings: Settings) => void
}

// 使用 persist 中间件来持久化 settings
export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            settings: { language: languages[0].name },
            setSettings: (newSettings) => set({ settings: newSettings }),
        }),
        {
            name: 'settings-storage', // 本地存储的 key
        },
    ),
)

interface SettingPanelProps {
    onSettingChange?: (settings: Settings) => void
}

export default function SettingPanel({
    onSettingChange = () => {},
}: SettingPanelProps) {
    const { settings, setSettings } = useSettingsStore()

    const handleSettingChange = (key: string, value: string) => {
        const newSettings = { ...settings, [key]: value }
        setSettings(newSettings)
        onSettingChange(newSettings)
    }

    return (
        <div>
            <div className='form-control'>
                <label className='label'>
                    <span className='label-text'>Language</span>
                </label>
                <Select
                    value={settings.language}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleSettingChange('language', e.target.value)
                    }
                    className='w-full max-w-xs'
                >
                    {languages.map((lang) => (
                        <Select.Option value={lang.name} key={lang.name}>
                            {lang.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </div>
    )
}
