# 本地图标库说明

## 📁 目录结构

```
nav/
├── public/
│   └── icons/           # 本地图标库
│       ├── github.svg
│       ├── notion.svg
│       ├── bilibili.svg
│       ├── cloudflare.svg
│       ├── alibabacloud.svg
│       ├── server.svg
│       ├── tools.svg
│       ├── grafana.svg
│       ├── google.svg
│       └── ...
├── work_v2.js
└── wrangler.toml
```

## 🎯 图标映射规则

| 域名 | 图标 | 分类 |
|:-----|:-----|:-----|
| github.com | github.svg | 开发工具 |
| notion.site | notion.svg | 办公协作 |
| bilibili.com | bilibili.svg | 视频娱乐 |
| cloudflare.com | cloudflare.svg | 云服务 |
| aliyun.com | alibabacloud.svg | 云服务 |
| volcengine.com | cloudflare.svg | 云服务 |
| racknerd.com | server.svg | VPS |
| hellohub.top | server.svg | VPS |
| grafana.com | grafana.svg | 监控 |

## 🔧 三层回退机制

```
1. site.logo（Yandex Favicon API）
   ↓ 如果为空或 404
2. LOCAL_ICON_MAP（本地图标库）
   ↓ 如果没有匹配
3. getRandomSVG()（随机 SVG 图标）
```

## 📊 图标统计

- **总图标数**: 14 个
- **总大小**: ~20 KB
- **平均每个**: ~1.4 KB

## 🎨 图标来源

- **Simple Icons** - https://simpleicons.org/
  - GitHub、Notion、Bilibili、Cloudflare 等品牌图标
  - SVG 格式，高质量
  - 免费开源

- **通用图标**
  - server.svg - 服务器/VPS 通用
  - tools.svg - 工具类通用
  - grafana.svg - 监控类通用

## 🚀 部署说明

### 本地测试

```bash
cd "/mnt/d/Desktop/GitHub project/nav"
npx wrangler dev --local
```

### 部署到 Cloudflare

```bash
cd "/mnt/d/Desktop/GitHub project/nav"
npx wrangler deploy
```

### 验证静态资源

部署后访问：
```
https://你的域名/icons/github.svg
https://你的域名/icons/notion.svg
```

## 📝 添加新图标

1. 从 Simple Icons 下载：
   ```bash
   curl -sL "https://cdn.simpleicons.org/品牌名" -o public/icons/品牌名.svg
   ```

2. 更新 `work_v2.js` 中的 `LOCAL_ICON_MAP`：
   ```javascript
   '新域名.com': '/icons/新图标.svg',
   ```

3. 重新部署：
   ```bash
   npx wrangler deploy
   ```

## ✅ 优势

- ✅ **加载快速** - 本地文件，无需外部请求
- ✅ **完全可控** - 图标自己管理
- ✅ **不依赖外部** - 不受 API 限制
- ✅ **有回退机制** - 即使图标库没有，也能正常显示

---

**最后更新**: 2026-03-18
