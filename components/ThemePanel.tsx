'use client'

import { useTheme } from 'next-themes'
import tailwindConfig from '@/tailwind.config'
import ThemeItem from './ThemeItem'
import { useEffect, useState } from 'react'

export const ThemePanel: React.FC = (props: React.ComponentProps<'div'>) => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // 确保组件在客户端渲染后再显示主题
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

    return (
        <div className="w-200" {...props}>
            <h4 className="mb-4">Current Theme: {theme}</h4>
            <div className="flex flex-wrap gap-4">
                <ThemeItem
                    key="theme_system"
                    dataTheme={systemTheme}
                    displayName="system"
                    role="button"
                    aria-label="Theme select"
                    aria-pressed={theme === 'system'}
                    selected={theme === 'system'}
                    tabIndex={0}
                    onClick={() => {
                        setTheme('system')
                    }}
                ></ThemeItem>
                {tailwindConfig.daisyui.themes.map((t, i) => (
                    <ThemeItem
                        key={`theme_${t}_#${i}`}
                        dataTheme={t}
                        role="button"
                        aria-label="Theme select"
                        aria-pressed={t === theme}
                        selected={t === theme}
                        tabIndex={0}
                        onClick={() => {
                            setTheme(t)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
