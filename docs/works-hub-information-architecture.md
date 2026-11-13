# WWZ.iM Works 信息架构与改版说明

## 页面定位
Works 是 WWZ.iM 的统一作品与知识入口，将原有的创作作品（Works）、独立项目（Projects）和技术文章（Blog & Guides）合并为一个可浏览、可跳转、可持续扩展的页面。主导航保留两个清晰入口：Works 与 Blog；Blog 直接定位到 Works 页面中的 Guides 区域。

## 页面结构

### Hero / 页面总览
- 主标题：Make ideas. Make them useful.
- 简介：概括视觉创作、独立数字产品与实践指南。
- 三个锚点：01 Creative work、02 Digital projects、03 Guides & notes。
- CSS 抽象球体与轨道作为统一视觉，不使用无关库存图片。

### 01 — Selected visual work
- 继续使用现有 `data/works.json` 和 `js/works.js`，保留 81 项作品数据。
- 保留分类筛选、关键词搜索、时间排序、灯箱、原始站酷链接和键盘/触控浏览。
- 明确标记 ZCOOL 原作来源，作品图片继续使用已有本地作品素材。

### 02 — Tools & projects
- APP.WWZ.iM：资源目录
- SUB.WWZ.iM：订阅格式转换
- RMB.WWZ.iM：人民币大写转换
- IP.WWZ.iM：网络信息查询
- VPS.WWZ.iM：服务器监控
- WBoard：GitHub 开源白板项目
- 使用主题化 CSS 视觉卡片，避免用虚构截图代表真实产品界面。每张卡片进入现有项目详情或源码。

### 03 — Guides & field notes
- 复用 `data/site-content.js` 的文章注册表和 `js/content-renderer.js`，避免维护两份文章列表。
- 重点文章使用 featured 区域，其余文章按卡片网格呈现。
- 保留分类标签、日期、阅读时长、封面图和文章原始链接。
- 下方保留 Linux/VPS、网络与路由器、AI/ComfyUI、备份恢复四个专题入口。

## 导航规则
- 主导航：Home / Works / Videos / Blog / About。
- Works 指向 `/works.html`；Blog 指向 `/works.html#guides`。
- Works 子导航提供 Selected Work、Digital Projects、Blog & Guides 三个锚点。
- Topics & Learning 保留 AI Lab、ComfyUI、Now，文章入口指向 Guides 区域。
- `/blog.html` 保留为兼容入口，自动跳转到 `/works.html#guides`。
- `/projects/` 保留为兼容入口，自动跳转到 `/works.html#projects`。
- 原项目详情页和文章详情页 URL 不变，已有外部链接继续有效。

## 视觉与响应式
- 沿用 WWZ.iM 现有语义色，整体采用暖白、矿物蓝、石墨灰与低饱和项目色。
- Hero 为双栏布局，移动端改为单栏，装饰图形淡化并退至背景。
- 创作作品继续采用真实作品图片；指南使用文章注册表中的实际封面；项目卡片采用 CSS 符号插画而非伪造截图。
- 项目卡片桌面三列、中等屏幕两列、手机单列；专题入口在手机两列。
- 深色模式与 prefers-reduced-motion 适配。

## 验收清单
- [ ] Works 页面包含创作、项目、指南三个区块，锚点可跳转。
- [ ] 原有 81 件创作作品加载、筛选、搜索、排序和灯箱可用。
- [ ] 项目卡片可进入原项目详情页或 WBoard 源码。
- [ ] 指南特色文章和文章网格从统一内容注册表正常渲染。
- [ ] 主导航 Blog 文案更新，Blog 锚点高亮正确。
- [ ] /blog.html 与 /projects/ 旧入口正常跳转。
- [ ] 原文章详情页、项目详情页保持原 URL 和功能。
- [ ] 桌面、移动、深色模式无明显溢出或对比度问题。
- [ ] 部署后抽查线上页面与控制台资源加载。
