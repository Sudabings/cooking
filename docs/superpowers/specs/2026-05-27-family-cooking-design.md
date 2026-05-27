# 家庭厨房点菜系统 — 设计文档

## 概述

一个供家庭成员使用的菜品浏览与点菜系统。React 单页应用（PWA），Supabase 提供后端，Vercel 部署。无需备案，打开网址即可使用，可添加到手机主屏幕。

## 登录

- 无需密码，打开 App 看到两个用户选项：「宝贝」和「自己」
- 点击头像/按钮即登录，无密码环节
- 下单时记录下单人，历史订单可按人筛选
- 仅「自己」能进入管理后台

## 页面结构

### 1. 首页 — 菜品浏览
- 顶部：用户头像（点击可切换用户）
- 分类标签栏：横向滑动，[全部] [荤菜] [素菜] [汤] [主食] …
- 菜品卡片网格（移动端 2 列）：图片、名称、一句话简介、烹饪时间、「+ 加入餐桌」按钮
- 底部固定栏：显示已选菜品数量和总数，「🛒 我的餐桌」入口

### 2. 我的餐桌（购物车）
- 已选菜品列表，每项：缩略图、名称、简介、[-] 数量 [+]、删除按钮
- 底部汇总：总菜品数量 + 「确认下单」按钮

### 3. 下单确认弹窗
- 列出所有已选菜品及数量
- 显示下单人
- 取消 / 确认下单按钮
- 确认后跳转订单详情页

### 4. 订单详情页
- 展示刚完成的订单完整清单
- 可截图分享给家人

### 5. 历史订单
- 按时间倒序排列过往订单
- 可按用户筛选

### 6. 管理后台 — 菜品管理
- 仅「自己」可访问，入口：首页角落齿轮图标
- 列表展示所有菜品，可编辑、删除
- 底部「+ 添加菜品」按钮
- 添加/编辑表单：上传图片、名称、一句话简介、烹饪时间、选择分类

### 7. 管理后台 — 分类管理
- 预设分类：荤菜、素菜、汤、主食
- 支持增删改

## 技术选型

| 项 | 选型 |
|---|---|
| 框架 | React 18 + TypeScript |
| 构建 | Vite |
| 样式 | Tailwind CSS |
| 路由 | React Router v6 |
| 状态 | React Context |
| PWA | vite-plugin-pwa |
| 后端 | Supabase（Database + Storage） |
| 部署 | Vercel |

## 数据模型

### profiles
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 显示名（宝贝/自己） |
| role | text | 'self' 或 'family' |

### categories
| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| name | text | 分类名 |
| sort_order | int | 排序 |

### dishes
| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| name | text | 菜品名 |
| description | text | 一句话简介 |
| cook_time | text | 烹饪时间 |
| image_url | text | 图片 URL（Supabase Storage） |
| category_id | int | 外键 → categories |
| created_at | timestamptz | 创建时间 |

### orders
| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| profile_id | uuid | 下单人 → profiles |
| created_at | timestamptz | 下单时间 |

### order_items
| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| order_id | int | 外键 → orders |
| dish_id | int | 外键 → dishes |
| quantity | int | 数量 |

## 简化认证方案

不启用 Supabase Auth。用极简方案：
- 客户端维护当前选中用户状态（localStorage 持久化）
- profiles 表只有两条记录：宝贝和自己
- 下单时直接传 profile_id
- 管理后台用 role 字段判断权限

## 路由设计

| 路径 | 页面 |
|------|------|
| `/` | 首页（菜品浏览） |
| `/cart` | 我的餐桌 |
| `/orders` | 历史订单 |
| `/orders/:id` | 订单详情 |
| `/admin` | 管理后台（菜品管理） |
| `/admin/categories` | 分类管理 |
| `/login` | 用户选择页（未登录时重定向至此） |
