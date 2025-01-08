import tailwindConfig from '@/tailwind.config.ts'
import ThemeItem from './ThemeItem'
import { create } from 'zustand'

interface Theme {
    mode: 'light' | 'dark' | 'follow-system'
    light: string
    dark: string
}

interface ThemeStore {
    theme: Theme
    setTheme: (newTheme: string) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: { light: 'ca', dark: 'dark', mode: 'follow-system' },
    setTheme: (newTheme: string) => {},
}))

function getTheme(theme: Theme) {
    // 根据传入的 theme 配置返回具体的主题
    if (theme.mode === 'light') {
        return theme.light
    }

    if (theme.mode === 'dark') {
        return theme.dark
    }

    // follow-system 模式下根据系统主题返回
    if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches
        return prefersDark ? theme.dark : theme.light
    }

    // 默认返回 light 主题
    return theme.light
}

export const ThemePanel: React.FC = (props: React.ComponentProps<'div'>) => {
    const { theme, setTheme } = useThemeStore()
    return (
        <div className="w-200" {...props}>
            <h4 className="mb-4">Theme</h4>
            <div className="flex flex-wrap gap-4">
                {tailwindConfig.daisyui.themes.map((t, i) => (
                    <ThemeItem
                        key={`theme_${t}_#${i}`}
                        dataTheme={t}
                        role="button"
                        aria-label="Theme select"
                        aria-pressed={t === getTheme(theme)}
                        selected={t === getTheme(theme)}
                        tabIndex={0}
                        onClick={() => {
                            document
                                .getElementsByTagName('html')[0]
                                .setAttribute('data-theme', t)
                            window.localStorage.setItem(
                                'sb-react-daisyui-preview-theme',
                                t,
                            )
                            setTheme(t)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
