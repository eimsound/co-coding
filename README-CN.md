# co-coding

## 项目简介

Co-Coding 是一个 meme 项目，灵感来源自 https://www.youtube.com/watch?v=ycTOEWqjeHI。你不觉得与你的朋友一起协同来做算法题是件狠酷的事情吗？该项目基于 Next.js 构建，并使用了 Monaco Editor。

## 主要特性：
- 算法题版本的双人成行: 通过独特的协作机制，让两人协同完成算法题。
- 换行即换人: 用户每次按下换行键，编辑权限自动切换到另一位用户，形成交替输入的协作模式。
- 共同完成: 两人需要通过交替操作共同完成代码逻辑。
- 实时更新: 通过 WebSockets 实现代码的实时同步，无缝展示对方的输入。

## 技术栈

- 前端：Next.js, React, TypeScript
- 后端：Node.js, Express
- 实时通信：Socket.IO
- 代码编辑器：Monaco Editor
- 容器化：Docker

## 快速开始

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 来查看效果

## TODO
- [ ] 支持多语言编辑器
- [ ] 支持更多人协同
- [ ] leetcode算法题支持
- [ ] 更多自定义规则
- [ ] 自定义字符串限制
