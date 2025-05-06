# Ignis Terra AI Solution Website

晟垚智能科技官方网站 | Official website of Ignis Terra AI Solution

## 项目概述 | Overview

晟垚智能科技专注于提供温暖而实用的 AI 解决方案，通过与人类协作而非替代的方式，帮助企业解决实际挑战。本仓库包含了我们的官方网站代码。

Ignis Terra AI Solution focuses on providing warm and practical AI solutions that collaborate with humans rather than replace them. This repository contains our official website code.

## 功能特点 | Features

- 🌐 多语言支持 (繁中/简中/英文) | Multi-language Support (Traditional Chinese/Simplified Chinese/English)
- 🎨 现代化响应式设计 | Modern Responsive Design
- ⚡ 优化的性能表现 | Optimized Performance
- 📱 移动端优先 | Mobile-First Approach
- 🔍 SEO 优化 | SEO Optimization

## 技术栈 | Tech Stack

- **框架 | Framework**: Next.js 14
- **UI 库 | UI Library**: React 18
- **样式 | Styling**: Tailwind CSS
- **动画 | Animations**: Framer Motion
- **国际化 | i18n**: next-i18next
- **部署 | Deployment**: Netlify

## 开发指南 | Development Guide

### 环境要求 | Prerequisites

- Node.js 18.0.0 或更高版本
- npm 或 yarn

### 安装 | Installation

```bash
# 克隆仓库 | Clone the repository
git clone https://github.com/ignisterra-ai/ignisterrawebsite.git

# 进入项目目录 | Enter the project directory
cd ignisterrawebsite

# 安装依赖 | Install dependencies
npm install
# 或 | or
yarn install
```

### 开发服务器 | Development Server

```bash
# 启动开发服务器 | Start development server
npm run dev
# 或 | or
yarn dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本 | Production Build

```bash
# 构建生产版本 | Build for production
npm run build
# 或 | or
yarn build

# 启动生产服务器 | Start production server
npm run start
# 或 | or
yarn start
```

## 部署 | Deployment

本网站通过 Netlify 自动部署。每次推送到 `master` 分支时都会触发自动部署流程。

The website is automatically deployed through Netlify. Each push to the `master` branch triggers the automatic deployment process.

## 项目结构 | Project Structure

```
├── components/       # React 组件
├── pages/           # 页面文件
├── public/          # 静态资源
├── styles/          # 全局样式
├── utils/           # 工具函数
└── locales/         # 多语言文件
```

## 图标需求 | Icon Requirements

部署前请确保所有必要的图标文件都已正确放置：

- `/public/favicon.ico` - 基本favicon
- `/public/favicon-16x16.png` - 16x16像素favicon
- `/public/favicon-32x32.png` - 32x32像素favicon
- `/public/apple-touch-icon.png` - 180x180像素 (iOS设备)
- `/public/safari-pinned-tab.svg` - Safari浏览器固定标签图标

## 贡献指南 | Contributing

如果您想为项目做出贡献，请：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证 | License

版权所有 © 2024 晟垚智能科技 | Copyright © 2024 Ignis Terra AI Solution

## 联系我们 | Contact

- Website: [https://ignisterra.ai](https://ignisterra.ai)
- Email: hi@ignisterra.ai
- LinkedIn: [Ignis Terra AI Solution](https://www.linkedin.com/company/ignisterra-ai) 