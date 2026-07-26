/**
 * WWZ content registry
 *
 * Add or edit videos and posts here only. The homepage, Videos page, and Blog
 * page render from this shared registry automatically.
 */
window.WWZ_CONTENT = {
  featuredVideoId: "rugone-xever-7",
  videos: [
    { id:"rugone-xever-7", title:"RugOne Xever 7", description:"Commercial Film", summary:"A cinematic campaign shaped around rugged performance, precise product detail, and an energetic outdoor visual language.", year:"2024", image:"images/video/Screenshot_2025-12-11_134113.jpg", embed:"https://player.vimeo.com/video/1149403074" },
    { id:"armor-34-pro", title:"Ulefone Armor 34 Pro", description:"Projector Phone Commercial", year:"2025", image:"images/video/maxresdefault.jpg", embed:"https://www.youtube.com/embed/a7RQgUMkpwI" },
    { id:"rugking-2-pro", title:"Ulefone RugKing 2 Pro", description:"The 5.45' Compact Rugged Beast", year:"2025", image:"images/video/Screenshot_2025-12-11_134159.jpg", embed:"https://www.youtube.com/embed/tOT3JojcKVE" },
    { id:"armor-mini-20t-pro", title:"Armor Mini 20T Pro", description:"Thermal Mini Product Launch", year:"2024", image:"images/video/Screenshot_2025-12-11_140000.jpg", embed:"https://www.youtube.com/embed/diWNAaazdoM" },
    { id:"armor-28", title:"Ulefone Armor 28", description:"World's Most Powerful Rugged Phone Ever!", year:"2025", image:"images/video/Screenshot_2025-03-05_142106.jpg", embed:"https://www.youtube.com/embed/H74qBMmDK5I" },
    { id:"armor-27t-pro", title:"Ulefone Armor 27T Pro", description:"FLIR Thermal Pro Campaign", year:"2024", image:"images/video/Screenshot_2025-03-05_142413.jpg", embed:"https://www.youtube.com/embed/aW8FSVuJY7U" },
    { id:"armor-26-ultra", title:"Ulefone Armor 26 Ultra", description:"Mega Performance 5G Launch", year:"2024", image:"images/video/Screenshot_2025-03-05_142626.jpg", embed:"https://www.youtube.com/embed/Y2yPBSYQkfw" },
    { id:"armor-24", title:"Ulefone Armor 24", description:"22000mAh Powerhouse", year:"2023", image:"images/video/Screenshot 2025-12-26 164244.jpg", embed:"https://www.youtube.com/embed/UN9yeUsnZ08" },
    { id:"armor-23-ultra", title:"Ulefone Armor 23 Ultra", description:"Satellite Communication Feature", year:"2024", image:"images/video/Screenshot_2025-12-11_135753.jpg", embed:"https://www.youtube.com/embed/ynM2jFYncnE" },
    { id:"armor-22", title:"Ulefone Armor 22", description:"NightElf Ultra 2.0 Night Vision", year:"2023", image:"images/video/Screenshot_2025-03-05_142821.jpg", embed:"https://www.youtube.com/embed/GVeko9aDHzw" },
    { id:"armor-x13", title:"Ulefone Armor X13", description:"Skip-Level Experience", year:"2024", image:"images/video/Screenshot_2025-03-05_142856.jpg", embed:"https://www.youtube.com/embed/7fCowk74l_Y" },
    { id:"armor-x12", title:"Ulefone Armor X12", description:"Xtra Tough, Xtra Speed", year:"2024", image:"images/video/Screenshot_2025-03-05_142942.jpg", embed:"https://www.youtube.com/embed/r4xApm6TeEM" },
    { id:"armor-pad-3-pro", title:"Ulefone Armor Pad 3 Pro", description:"33280mAh Battery Flagship Rugged Tablet", year:"2024", image:"images/video/Screenshot_2025-03-05_142527.jpg", embed:"https://www.youtube.com/embed/h8ZVScdsWGc" },
    { id:"note-16-pro", title:"Ulefone Note 16 Pro", description:"Elegance Meets Experience", year:"2024", image:"images/video/Screenshot_2025-03-05_143145.jpg", embed:"https://www.youtube.com/embed/GEfBRDodXwI" },
    { id:"armor-19t", title:"Ulefone Armor 19T", description:"Top Performance Thermal Imaging Smartphone", year:"2023", image:"images/video/Screenshot 2025-12-26 165831.jpg", embed:"https://www.youtube.com/embed/IgGQtgF7OOs" },
    { id:"armor-15", title:"Ulefone Armor 15", description:"Rugged Phone with Built-in TWS Earbuds", year:"2023", image:"images/video/Screenshot_2025-03-05_143415.jpg", embed:"https://www.youtube.com/embed/JFRP5vrq1c0" },
    { id:"armor-14", title:"Ulefone Armor 14", description:"Faster, Stronger, More Updated", year:"2023", image:"images/video/Screenshot_2025-12-11_135115.jpg", embed:"https://www.youtube.com/embed/9FjD_3j-qYg" },
    { id:"armor-13", title:"Ulefone Armor 13", description:"Ultra-Large Battery Rugged Phone", year:"2021", image:"images/video/Screenshot_2025-12-11_134541.jpg", embed:"https://www.youtube.com/embed/fAaV4eftTAs" }
  ],
  posts: [
    { id:"be6500-shellcrash", title:"安装ShellCrash科学上网", excerpt:"小米路由器 BE6500 解锁 SSH 并安装 ShellCrash，无需刷入 OpenWrt，同时保留路由器原有功能。BE3600 与 AX3000T 也可参考。", date:"Nov 2025", readTime:"1 min", category:"Network", tags:["Router","SSH"], image:"images/blog/ShellCrash.jpg", href:"article/BE6500-SSH/" },
    { id:"linux-order", title:"服务器初始化与部署指南", excerpt:"基础环境配置、常用工具安装、Xray 面板与系统维护。助你从零开始构建稳定的服务端环境。", date:"Jan 2026", readTime:"8 min", category:"Infrastructure", tags:["Web","Server"], image:"article/LiunxOrder/image.png", href:"article/LiunxOrder/", featured:true },
    { id:"xui", title:"3X-UI 安装与 TLS 升级指南", excerpt:"3X-UI 面板一键安装、TLS 证书申请与安全配置。可视化管理你的多协议节点。", date:"2024", readTime:"6 min", category:"Server", tags:["Server"], image:"article/xui/image.png", href:"article/xui/" },
    { id:"hysteria2", title:"Hysteria 2 部署与网络优化", excerpt:"从服务端配置到客户端连接的完整实践记录，包含协议优化与拥塞控制。", date:"2024", readTime:"7 min", category:"Network", tags:["Network"], image:"article/hysteria2/image.png", href:"article/hysteria2/" }
  ]
};
