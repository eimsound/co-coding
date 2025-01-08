import { StreamLanguage } from '@codemirror/language'

export const languages = [
    {
        name: 'Python',
        extension: () =>
            import('@codemirror/legacy-modes/mode/python').then(({ python }) =>
                StreamLanguage.define(python)
            )
    },
    {
        name: 'C#',
        extension: () =>
            import('@codemirror/legacy-modes/mode/clike').then(({ csharp }) =>
                StreamLanguage.define(csharp)
            )
    },
    {
        name: 'C++',
        extension: () =>
            import('@codemirror/legacy-modes/mode/clike').then(({ cpp }) =>
                StreamLanguage.define(cpp)
            )
    },
    {
        name: 'C',
        extension: () =>
            import('@codemirror/legacy-modes/mode/clike').then(({ c }) =>
                StreamLanguage.define(c)
            )
    },
    {
        name: 'JavaScript',
        extension: () =>
            import('@codemirror/legacy-modes/mode/javascript').then(
                ({ javascript }) => StreamLanguage.define(javascript)
            )
    },
    {
        name: 'TypeScript',
        extension: () =>
            import('@codemirror/legacy-modes/mode/javascript').then(
                ({ typescript }) => StreamLanguage.define(typescript)
            )
    },
    {
        name: 'Kotlin',
        extension: () =>
            import('@codemirror/legacy-modes/mode/clike').then(({ kotlin }) =>
                StreamLanguage.define(kotlin)
            )
    },
    {
        name: 'Java',
        extension: () =>
            import('@codemirror/legacy-modes/mode/clike').then(({ java }) =>
                StreamLanguage.define(java)
            )
    },
    {
        name: 'PHP',
        extension: () =>
            import('@codemirror/lang-php').then(({ php }) => php())
    },
    {
        name: 'Swift',
        extension: () =>
            import('@codemirror/legacy-modes/mode/swift').then(({ swift }) =>
                StreamLanguage.define(swift)
            )
    },
    {
        name: 'Dart',
        extension: () =>
            import('@codemirror/legacy-modes/mode/clike').then(({ dart }) =>
                StreamLanguage.define(dart)
            )
    },
    {
        name: 'Go',
        extension: () =>
            import('@codemirror/legacy-modes/mode/go').then(({ go }) =>
                StreamLanguage.define(go)
            )
    },
    {
        name: 'Ruby',
        extension: () =>
            import('@codemirror/legacy-modes/mode/ruby').then(({ ruby }) =>
                StreamLanguage.define(ruby)
            )
    },
    {
        name: 'Scala',
        extension: () =>
            import('@codemirror/legacy-modes/mode/clike').then(({ scala }) =>
                StreamLanguage.define(scala)
            )
    },
    {
        name: 'Rust',
        extension: () =>
            import('@codemirror/legacy-modes/mode/rust').then(({ rust }) =>
                StreamLanguage.define(rust)
            )
    },
    {
        name: 'Racket',
        extension: () =>
            import('@codemirror/legacy-modes/mode/scheme').then(({ scheme }) =>
                StreamLanguage.define(scheme)
            )
    },
    {
        name: 'Erlang',
        extension: () =>
            import('@codemirror/legacy-modes/mode/erlang').then(({ erlang }) =>
                StreamLanguage.define(erlang)
            )
    },
    {
        name: 'Elixir',
        extension: () =>
            import('codemirror-lang-elixir').then(({ elixir }) => elixir())
    }
]