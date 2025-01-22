import { Extension } from '@uiw/react-codemirror'
import { catppuccin } from 'codemirror-theme-catppuccin'

const darkCodeMirrorTheme = catppuccin('macchiato')
const lightCodeMirrorTheme = catppuccin('latte')

export const themeMap = {
    light: lightCodeMirrorTheme,
    dark: darkCodeMirrorTheme,
    acid: lightCodeMirrorTheme,
    aqua: darkCodeMirrorTheme,
    autumn: lightCodeMirrorTheme,
    black: darkCodeMirrorTheme,
    bumblebee: lightCodeMirrorTheme,
    business: darkCodeMirrorTheme,
    cmyk: lightCodeMirrorTheme,
    coffee: darkCodeMirrorTheme,
    corporate: lightCodeMirrorTheme,
    cupcake: lightCodeMirrorTheme,
    cyberpunk: lightCodeMirrorTheme,
    dim: darkCodeMirrorTheme,
    dracula: darkCodeMirrorTheme,
    emerald: lightCodeMirrorTheme,
    fantasy: lightCodeMirrorTheme,
    forest: darkCodeMirrorTheme,
    garden: lightCodeMirrorTheme,
    halloween: darkCodeMirrorTheme,
    lemonade: lightCodeMirrorTheme,
    lofi: lightCodeMirrorTheme,
    luxury: darkCodeMirrorTheme,
    night: darkCodeMirrorTheme,
    nord: lightCodeMirrorTheme,
    pastel: lightCodeMirrorTheme,
    retro: lightCodeMirrorTheme,
    sunset: darkCodeMirrorTheme,
    synthwave: darkCodeMirrorTheme,
    valentine: lightCodeMirrorTheme,
    winter: lightCodeMirrorTheme,
    wireframe: lightCodeMirrorTheme,
}

export function getCodeMirrorTheme(theme: string | undefined): Extension {
    if (!theme || theme === 'system') {
        const isDarkMode = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches
        return isDarkMode ? darkCodeMirrorTheme : lightCodeMirrorTheme
    }
    if (theme in themeMap) {
        return themeMap[theme as keyof typeof themeMap]
    }
    return lightCodeMirrorTheme
}
