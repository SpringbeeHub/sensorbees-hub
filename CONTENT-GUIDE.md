# SpringBees Hub 内容编辑指南

## 文件结构

```
products/     → 产品管理
pages/        → 页面管理
downloads/    → 下载资源
faq/          → FAQ 管理
assets/uploads/ → 图片等资源文件
```

---

## 🛒 产品管理 (`products/`)

每个产品一个 `.md` 文件，文件名用英文小写+短横线，如 `th-s01-temp-humidity.md`

```markdown
---
title: "产品名称"
category: "Temperature & Humidity"
description: "产品简介，一两句话"
image: "/assets/uploads/产品图片.png"
badge: "Popular"
---

产品详细参数和说明写在这里，支持 Markdown 格式。

## 技术参数

| 参数 | 值 |
|------|-----|
| 量程 | -40~125°C |
| 精度 | ±0.3°C |
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| title | ✅ | 产品名称 |
| category | ✅ | 分类，必须选以下之一：`Temperature & Humidity` / `RS485 Industrial` / `Analog (4~20mA)` / `Agriculture` / `Accessories` |
| description | ✅ | 产品简介 |
| image | ❌ | 产品图片路径，先上传到 `assets/uploads/` |
| badge | ❌ | 标签，如 `Popular`、`Hot`、`New` |
| 正文(body) | ❌ | 详细参数，--- 以下的内容 |

---

## 📄 页面管理 (`pages/`)

每个页面一个 `.md` 文件，如 `about.md`

```markdown
---
title: "关于我们"
order: 1
---

页面正文内容，支持 Markdown 格式。

可以加标题、列表、链接等。
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| title | ✅ | 页面标题 |
| order | ❌ | 排序权重，数字越小越靠前，默认 0 |
| 正文(body) | ❌ | --- 以下的内容 |

---

## 📥 下载资源 (`downloads/`)

每个资源一个 `.md` 文件，如 `user-manual.md`

```markdown
---
title: "用户手册"
description: "产品使用说明文档"
file_url: "https://example.com/manual.pdf"
icon: "📋"
---

详情说明（可选），可以补充更多下载相关信息。
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| title | ✅ | 资源标题 |
| description | ✅ | 描述 |
| file_url | ✅ | 文件下载链接 |
| icon | ❌ | 图标 emoji，默认 📋 |
| 正文(body) | ❌ | 详情说明 |

---

## ❓ FAQ 管理 (`faq/`)

每个问题一个 `.md` 文件，如 `how-to-connect-rs485.md`

```markdown
---
title: "如何连接RS485传感器？"
---

回答内容写在这里，支持 Markdown 格式。

1. 第一步...
2. 第二步...
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| title | ✅ | 问题 |
| 正文(body) | ✅ | 回答，--- 以下的内容 |

---

## 📝 编辑步骤（GitHub 网页操作）

1. 打开 https://github.com/SpringbeeHub/sensorbees-hub
2. 进入对应文件夹（如 `products/`）
3. 点 **Add file** → **Create new file**（新建）或点击已有文件点 ✏️ 编辑
4. 按模板格式填写内容
5. 点 **Commit changes** 保存
6. 等 1-2 分钟，网站自动更新

## 🖼️ 上传图片

1. 先进入 `assets/uploads/` 文件夹
2. 点 **Add file** → **Upload files**，上传图片
3. 在产品/页面文件中引用：`image: "/assets/uploads/文件名.png"`
