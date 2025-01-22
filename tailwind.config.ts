import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        'node_modules/daisyui/dist/**/*.js',
        'node_modules/react-daisyui/dist/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            'light',
            'dark',
            'acid',
            'aqua',
            'autumn',
            'black',
            'bumblebee',
            'business',
            'cmyk',
            'coffee',
            'corporate',
            'cupcake',
            'cyberpunk',
            'dim',
            'dracula',
            'emerald',
            'fantasy',
            'forest',
            'garden',
            'halloween',
            'lemonade',
            'lofi',
            'luxury',
            'night',
            'nord',
            'pastel',
            'retro',
            'sunset',
            'synthwave',
            'valentine',
            'winter',
            'wireframe',
        ],
    },
} satisfies Config
