# Ignis AI Solution Website

这是Ignis AI Solution的官方网站代码仓库。网站展示了我们的AI解决方案与服务。

## 开发指南

首先，安装依赖：

```bash
npm install
# 或
yarn install
```

然后，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 技术栈

- Next.js
- React
- Tailwind CSS 

## 网站图标需求

在部署前，请确保创建以下网站图标文件并放置在正确位置：

- `/public/favicon.ico` - 基本favicon（已存在）
- `/public/favicon-16x16.png` - 16x16像素favicon
- `/public/favicon-32x32.png` - 32x32像素favicon
- `/public/apple-touch-icon.png` - 180x180像素，用于iOS设备
- `/public/safari-pinned-tab.svg` - Safari浏览器固定标签图标

另外，确保以下图标文件与manifest.json中的配置匹配：
- `/public/icons/icon-72x72.png`
- `/public/icons/icon-96x96.png`
- `/public/icons/icon-128x128.png`
- `/public/icons/icon-144x144.png`
- `/public/icons/icon-152x152.png`
- `/public/icons/icon-192x192.png`
- `/public/icons/icon-384x384.png`
- `/public/icons/icon-512x512.png`

您可以使用在线工具如[Favicon Generator](https://realfavicongenerator.net/)或[Favicon.io](https://favicon.io/)从您的Logo创建这些图片。 