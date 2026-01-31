# WWZ.iM - Glassmorphism Personal Portfolio

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

一个极简、现代且高性能的个人主页/作品集网站模板。采用 **玻璃拟态 (Glassmorphism)** 设计风格，内置平滑的日夜间模式切换、响应式布局以及丰富的交互动画。

[查看在线演示](https://wwz.im) (替换为你的实际链接)

## ✨ 核心特性 (Features)

* **🎨 玻璃拟态设计 (Glassmorphism)**: 全局采用磨砂玻璃质感，配合动态渐变背景，视觉效果现代且高级。
* **🌓 智能日夜模式**:
    * 自动跟随系统偏好 (System Preference)。
    * 支持手动切换并记忆用户选择 (LocalStorage)。
    * **防闪烁处理**: 头部阻塞脚本确保加载时无白屏闪烁。
* **📱 完全响应式**: 适配手机、平板、桌面端。移动端拥有独立的侧边栏交互逻辑。
* **🖱️ 自定义鼠标特效**: 桌面端配备平滑跟随的圆点光标，悬停时产生吸附放大效果（移动端自动隐藏以保持原生体验）。
* **🖼️ 高级图片灯箱**:
    * 支持全屏无边框查看大图。
    * **智能加载**: 点击缩略图自动加载高清原图，节省带宽。
    * 支持点击任意区域快速关闭。
* **🧱 瀑布流布局**: 集成 Isotope.js，实现优雅的作品集筛选与布局。
* **📹 3D 视频卡片**: 首页 Hero 区域包含随鼠标视差移动的 3D 视频展示卡片。

## 🛠️ 技术栈 (Tech Stack)

* **核心**: HTML5, CSS3 (CSS Variables), JavaScript (ES6+)
* **框架**: Bootstrap 5.3 (Grid & Utilities)
* **字体**: SF Pro Display (主要), JetBrains Mono (代码/等宽)
* **图标**: FontAwesome 6
* **插件**:
    * `Isotope.js`: 用于瀑布流布局过滤。
    * `IntersectionObserver`: 用于滚动监听和导航高亮。

## 📂 目录结构 (Directory Structure)

```text
├── css/                  # 样式文件 (vendor等)
├── js/                   # 脚本文件
├── images/               # 图片资源
│   ├── favicon_io/       # 网站图标
│   ├── video/            # 视频封面
│   ├── portfolio-thumbnail-*.jpg  # 作品缩略图
│   ├── portfolio-large-*.jpg      # 作品高清大图
│   └── main-logo.png     # 侧边栏 Logo
├── index.html            # 主页 (包含 Hero, Video, Works, About)
├── portfolio-masonry.html # 完整作品集 (瀑布流筛选)
├── styles.html           # 设计系统规范 (UI Kit)
├── team.html             # 团队介绍页
├── blog.html             # 博客列表页
└── README.md             # 说明文档
