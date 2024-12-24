# Co-Coding

## Project Introduction

Co-Coding is a meme project inspired by [this video](https://www.youtube.com/watch?v=ycTOEWqjeHI). Don't you think collaborating with your friends to solve algorithm problems is incredibly cool? This project is built with [Next.js](https://nextjs.org/) and uses the [Monaco Editor](https://microsoft.github.io/monaco-editor/).

## Key Features:
- **Two-Person Algorithm Adventure**: A unique collaboration mechanism where two people solve algorithm problems together.
- **Switch on Enter**: When one user presses Enter, editing permissions automatically switch to the other user, creating an alternating input experience.
- **Collaborative Completion**: Both users must work together, taking turns to complete the code logic.
- **Real-Time Updates**: Uses WebSockets for real-time synchronization, seamlessly displaying the other user's input.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express
- **Real-Time Communication**: Socket.IO
- **Code Editor**: Monaco Editor
- **Containerization**: Docker

## Quick Start

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## TODO
- [ ] Support for multiple languages in the editor
- [ ] Enable collaboration for more users
- [ ] Integration with LeetCode problems
- [ ] More customizable rules
- [ ] Support for custom string constraints

---
