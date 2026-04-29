# 拾光集 - 精品网址导航站

一个优雅、快速、易于部署的书签收藏与分享平台，完全基于 Cloudflare 全家桶构建。

<p align="center">
  <img src="https://github.com/user-attachments/assets/c0200239-4b89-4f3f-9d5d-99f731661d7c" alt="拾光集Logo" width="200">
</p>

<p align="center">
  <a href="https://github.com/XDG2319/my-nav/blob/main/CHANGELOG.md"><img src="https://img.shields.io/badge/v1.0.35-blue?style=flat" alt="Version"></a>
  <a href="https://github.com/XDG2319/my-nav/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
  <a href="https://sq.hellohub.top"><img src="https://img.shields.io/badge/Demo-在线体验-orange?style=flat" alt="Demo"></a>
</p>

---

## 预览

| 首页 | 后台管理 |
| :---: | :---: |
| ![首页预览](https://github.com/user-attachments/assets/b12755c5-7669-408f-be05-2db6ba1b02cc) | ![后台预览](https://github.com/user-attachments/assets/d387794d-95f8-42e9-879d-41fc6c5f5fa8) |

**在线体验**: [https://sq.hellohub.top](https://sq.hellohub.top)

---

## 特性

- **响应式设计** — 完美适配桌面、平板和手机
- **简洁优雅** — 基于 TailwindCSS，支持自定义主色调
- **快速搜索** — 内置站内模糊搜索，支持 ID 前缀匹配
- **分类管理** — 拖拽排序分类和书签，直观高效
- **安全后台** — KV 存储凭据，12 小时 HttpOnly 会话 Cookie
- **访客投稿** — 支持访客提交书签，管理员审核后显示，可通过环境变量关闭
- **边缘缓存** — 利用 Cloudflare Cache API，秒级加载，降低 D1 读取成本
- **数据导入导出** — 支持 JSON 格式导入导出，方便迁移
- **新书签高亮** — 新添加的书签自动高亮，悬停后取消
- **重复检测** — 添加/导入书签时自动检测重复 URL

---

## 快速部署

> **前提**: 需要一个 [Cloudflare](https://dash.cloudflare.com/) 账号。

### 1. 创建 D1 数据库

进入 **Workers & Pages → D1**，创建名为 `book` 的数据库，然后在数据库控制台执行：

```sql
CREATE TABLE sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo TEXT,
  "desc" TEXT,
  catelog TEXT NOT NULL,
  status TEXT,
  sort_order INTEGER NOT NULL DEFAULT 9999,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pending_sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo TEXT,
  "desc" TEXT,
  catelog TEXT NOT NULL,
  status TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category_orders (
  catelog TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 9999
);
```

### 2. 创建 KV 命名空间

进入 **Workers & Pages → KV**，创建名为 `NAV_AUTH` 的命名空间，然后添加两个键值对：

| 键 | 值 |
|:---|:---|
| `admin_username` | 你的管理员用户名 |
| `admin_password` | 你的管理员密码 |

### 3. 部署 Worker

1. 进入 **Workers & Pages → 创建应用程序 → 创建 Worker**，命名为 `my-nav`
2. 点击 **编辑代码**，将 [`work_v2.js`](work_v2.js) 的内容完整粘贴进去，点击 **部署**

### 4. 绑定服务

进入 Worker 的 **设置 → 变量**，添加绑定：

| 类型 | 变量名称 | 选择 |
|:-----|:---------|:-----|
| D1 数据库 | `NAV_DB` | `book` |
| KV 命名空间 | `NAV_AUTH` | `NAV_AUTH` |

### 5. 开始使用

1. 访问 Worker 域名（如 `my-nav.你的子域.workers.dev`）
2. 访问 `/admin` 进入后台，用步骤 2 设置的账号密码登录
3. 在后台添加第一个书签，首页即可正常显示

---

## 自定义

### 主题颜色

修改 `work_v2.js` 中的 `tailwind.config` 对象：

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#416d9d', // 改为你喜欢的主色调
        },
      },
    }
  }
}
```

### 关闭访客投稿

在 Worker 环境变量中添加 `ENABLE_PUBLIC_SUBMISSION=false`，前台投稿入口和 API 将同时关闭。

### 排序规则

- **书签排序**: 排序值越小越靠前
- **分类排序**: 优先读取 `category_orders` 表，未设置则按书签最小排序值 + 名称排序，可在后台"分类排序"标签页直接编辑

### 图标格式

书签图标支持 HTTPS URL、HTTP URL（自动升级为 HTTPS）、Base64 图片三种格式。显示优先级：书签 `logo` 字段 → 本地图标库 → 随机彩色字母图标。

---

## 项目结构

```
my-nav/
├── work_v2.js          # Worker 主脚本（包含前后端全部逻辑）
├── schema.sql          # 数据库建表 SQL
├── wrangler.toml       # Cloudflare Workers 配置
├── public/
│   ├── favicon.svg     # 站点图标
│   └── icons/          # 本地图标库（SVG）
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 自动部署
├── CHANGELOG.md        # 更新日志
└── LICENSE             # MIT 许可证
```

---

## 技术栈

| 组件 | 技术 |
|:-----|:-----|
| 运行时 | [Cloudflare Workers](https://workers.cloudflare.com/) |
| 数据库 | [Cloudflare D1](https://developers.cloudflare.com/d1/) |
| 存储 | [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/) |
| 前端 | [TailwindCSS](https://tailwindcss.com/) |

---

## 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)

---

## 许可证

[MIT](LICENSE)