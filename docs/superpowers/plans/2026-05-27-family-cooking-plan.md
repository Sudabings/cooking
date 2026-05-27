# 家庭厨房点菜系统 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个家庭菜品浏览和点菜的 PWA 应用，支持图片展示、分类筛选、购物车式点菜、订单管理和简单的管理后台。

**Architecture:** React 18 SPA with TypeScript, Supabase 作为后端（数据库 + 存储），Vite 构建，Tailwind CSS 样式，React Router v6 路由，React Context 管理认证和购物车状态，vite-plugin-pwa 实现 PWA。

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Supabase JS SDK, vite-plugin-pwa

---

## File Structure

```
cooking/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── supabase/
│   └── schema.sql              # 数据库建表 SQL
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css               # Tailwind directives
│   ├── lib/
│   │   └── supabase.ts         # Supabase 客户端
│   ├── types/
│   │   └── index.ts            # 所有 TypeScript 类型
│   ├── context/
│   │   ├── AuthContext.tsx      # 用户选择状态
│   │   └── CartContext.tsx      # 购物车状态
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── CartPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── OrderHistoryPage.tsx
│   │   └── admin/
│   │       ├── DishManagePage.tsx
│   │       └── CategoryManagePage.tsx
│   └── components/
│       ├── Layout.tsx
│       ├── DishCard.tsx
│       ├── CategoryTabs.tsx
│       ├── CartItem.tsx
│       ├── BottomBar.tsx
│       ├── OrderConfirmModal.tsx
│       └── ImageUpload.tsx
```

---

### Task 1: 项目脚手架搭建

**Files:**
- Create: `package.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `public/favicon.svg`

- [ ] **Step 1: 用 Vite 创建 React + TypeScript 项目**

```bash
cd D:/桌面/cooking && npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: 安装依赖**

```bash
npm install react-router-dom @supabase/supabase-js
npm install -D tailwindcss @tailwindcss/vite vite-plugin-pwa
```

- [ ] **Step 3: 配置 Vite (vite.config.ts)**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '家庭厨房',
        short_name: '厨房',
        theme_color: '#f97316',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    })
  ]
})
```

- [ ] **Step 4: 配置 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#f97316" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>家庭厨房</title>
  </head>
  <body class="bg-gray-50 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: 配置 Tailwind (src/index.css)**

```css
@import "tailwindcss";
```

- [ ] **Step 6: 写 favicon.svg (public/favicon.svg)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍳</text></svg>
```

- [ ] **Step 7: 验证项目能跑**

```bash
npm run dev
```

Expected: 浏览器打开 http://localhost:5173 看到 Vite + React 默认页面

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind project"
```

---

### Task 2: TypeScript 类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 写入所有类型定义**

```typescript
export interface Profile {
  id: string
  name: string
  role: 'self' | 'family'
}

export interface Category {
  id: number
  name: string
  sort_order: number
}

export interface Dish {
  id: number
  name: string
  description: string
  cook_time: string
  image_url: string
  category_id: number
  created_at: string
  category?: Category
}

export interface CartItem {
  dish: Dish
  quantity: number
}

export interface Order {
  id: number
  profile_id: string
  created_at: string
  items?: OrderItem[]
  profile?: Profile
}

export interface OrderItem {
  id: number
  order_id: number
  dish_id: number
  quantity: number
  dish?: Dish
}
```

- [ ] **Step 2: 验证编译通过**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts && git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: Supabase 客户端 & 数据库 Schema

**Files:**
- Create: `src/lib/supabase.ts`, `supabase/schema.sql`

- [ ] **Step 1: 创建 Supabase 客户端 (src/lib/supabase.ts)**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: 创建 .env 文件**

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 3: 创建数据库 Schema (supabase/schema.sql)**

```sql
-- 用户表
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('self', 'family'))
);

-- 插入默认用户
INSERT INTO profiles (name, role) VALUES ('宝贝', 'family'), ('自己', 'self');

-- 分类表
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

INSERT INTO categories (name, sort_order) VALUES
  ('荤菜', 1), ('素菜', 2), ('汤', 3), ('主食', 4);

-- 菜品表
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cook_time TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 订单表
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 订单项表
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  dish_id INT REFERENCES dishes(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1
);

-- 启用 RLS 但允许所有操作（私人使用）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all" ON dishes FOR ALL USING (true);
CREATE POLICY "Allow all" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all" ON order_items FOR ALL USING (true);

-- Storage bucket for dish images (需要在 Supabase Dashboard 手动创建)
-- Bucket name: dishes, 设为 public
```

- [ ] **Step 4: 在 Supabase Dashboard 中执行 SQL 和创建 Storage bucket**

打开 Supabase Dashboard → SQL Editor → 粘贴 schema.sql 并执行。然后到 Storage → 创建名为 `dishes` 的 public bucket。

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase.ts supabase/schema.sql && git commit -m "feat: add Supabase client and database schema"
```

---

### Task 4: AuthContext — 用户选择状态

**Files:**
- Create: `src/context/AuthContext.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 AuthContext (src/context/AuthContext.tsx)**

```typescript
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

interface AuthContextType {
  profile: Profile | null
  profiles: Profile[]
  login: (p: Profile) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('profile')
    return saved ? JSON.parse(saved) : null
  })
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => {
      if (data) setProfiles(data)
    })
  }, [])

  const login = (p: Profile) => {
    setProfile(p)
    localStorage.setItem('profile', JSON.stringify(p))
  }

  const logout = () => {
    setProfile(null)
    localStorage.removeItem('profile')
  }

  return (
    <AuthContext.Provider value={{ profile, profiles, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
```

- [ ] **Step 2: 包裹 App.tsx**

```typescript
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
```

(暂时 AppRoutes 为空占位，后续 task 补充)

- [ ] **Step 3: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/context/AuthContext.tsx src/App.tsx && git commit -m "feat: add AuthContext for user selection"
```

---

### Task 5: CartContext — 购物车状态

**Files:**
- Create: `src/context/CartContext.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 CartContext (src/context/CartContext.tsx)**

```typescript
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Dish, CartItem } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (dish: Dish) => void
  removeItem: (dishId: number) => void
  updateQuantity: (dishId: number, quantity: number) => void
  clearCart: () => void
  totalCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (dish: Dish) => {
    setItems(prev => {
      const existing = prev.find(item => item.dish.id === dish.id)
      if (existing) {
        return prev.map(item =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { dish, quantity: 1 }]
    })
  }

  const removeItem = (dishId: number) => {
    setItems(prev => prev.filter(item => item.dish.id !== dishId))
  }

  const updateQuantity = (dishId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.dish.id === dishId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
```

- [ ] **Step 2: 在 App.tsx 中包装 CartProvider**

```typescript
import { CartProvider } from './context/CartContext'

// 在 AuthProvider 内包裹 CartProvider:
// <AuthProvider>
//   <CartProvider>
//     <AppRoutes />
//   </CartProvider>
// </AuthProvider>
```

- [ ] **Step 3: Commit**

```bash
git add src/context/CartContext.tsx src/App.tsx && git commit -m "feat: add CartContext for shopping cart state"
```

---

### Task 6: 路由设置 + Layout 组件

**Files:**
- Create: `src/components/Layout.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 Layout 组件 (src/components/Layout.tsx)**

Layout 不包含底部导航（首页的 BottomBar 是首页专属），只是一个带顶栏的壳：

```typescript
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const showBack = location.pathname !== '/' && location.pathname !== '/login'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-orange-500 text-white shadow">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            {showBack && (
              <button onClick={() => navigate(-1)} className="text-xl">&larr;</button>
            )}
            <h1 className="text-lg font-bold">家庭厨房</h1>
          </div>
          {profile && (
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-orange-600 px-3 py-1 rounded-full"
            >
              {profile.name}
            </button>
          )}
        </div>
      </header>
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: 在 App.tsx 中设置路由**

```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderDetailPage from './pages/OrderDetailPage'
import DishManagePage from './pages/admin/DishManagePage'
import CategoryManagePage from './pages/admin/CategoryManagePage'

function AppRoutes() {
  const { profile } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={profile ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/admin" element={<DishManagePage />} />
        <Route path="/admin/categories" element={<CategoryManagePage />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout.tsx src/App.tsx && git commit -m "feat: add routing and Layout component"
```

---

### Task 7: LoginPage — 用户选择页

**Files:**
- Create: `src/pages/LoginPage.tsx`

- [ ] **Step 1: 创建 LoginPage**

```typescript
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { profile, profiles, login, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (p: typeof profiles[number]) => {
    login(p)
    navigate('/')
  }

  if (profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">当前用户</h1>
        <div className="text-5xl mb-4">
          {profile.name === '自己' ? '🧑' : '👶'}
        </div>
        <p className="text-xl font-semibold">{profile.name}</p>
        <button
          onClick={() => { logout(); }}
          className="text-orange-500 underline"
        >
          切换用户
        </button>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-orange-500 text-white px-8 py-3 rounded-xl text-lg font-semibold"
        >
          进入厨房
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🍳 家庭厨房</h1>
      <p className="text-gray-500 mb-4">选择你的身份</p>
      <div className="flex gap-8">
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => handleLogin(p)}
            className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl active:scale-95 transition-all"
          >
            <span className="text-5xl">
              {p.name === '自己' ? '🧑' : '👶'}
            </span>
            <span className="text-lg font-semibold">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/LoginPage.tsx && git commit -m "feat: add LoginPage with user selection"
```

---

### Task 8: CategoryTabs 组件

**Files:**
- Create: `src/components/CategoryTabs.tsx`

- [ ] **Step 1: 创建 CategoryTabs**

```typescript
import type { Category } from '../types'

interface Props {
  categories: Category[]
  activeId: number | null
  onChange: (id: number | null) => void
}

export default function CategoryTabs({ categories, activeId, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          activeId === null
            ? 'bg-orange-500 text-white'
            : 'bg-white text-gray-600 border border-gray-200'
        }`}
      >
        全部
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeId === cat.id
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CategoryTabs.tsx && git commit -m "feat: add CategoryTabs component"
```

---

### Task 9: DishCard 组件

**Files:**
- Create: `src/components/DishCard.tsx`

- [ ] **Step 1: 创建 DishCard**

```typescript
import type { Dish } from '../types'

interface Props {
  dish: Dish
  onAdd: (dish: Dish) => void
}

export default function DishCard({ dish, onAdd }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100">
        {dish.image_url ? (
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            🍽️
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 truncate">{dish.name}</h3>
        {dish.description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{dish.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{dish.cook_time}</span>
          <button
            onClick={() => onAdd(dish)}
            className="bg-orange-500 text-white text-sm w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DishCard.tsx && git commit -m "feat: add DishCard component"
```

---

### Task 10: BottomBar 组件

**Files:**
- Create: `src/components/BottomBar.tsx`

- [ ] **Step 1: 创建 BottomBar**

```typescript
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function BottomBar() {
  const { totalCount } = useCart()
  const { profile } = useAuth()
  const navigate = useNavigate()

  if (totalCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-20">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3" onClick={() => navigate('/cart')}>
          <span className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          </span>
          <span className="text-sm text-gray-500">
            {profile?.name} 的餐桌
          </span>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold text-sm active:bg-orange-600"
        >
          去下单
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BottomBar.tsx && git commit -m "feat: add BottomBar component"
```

---

### Task 11: HomePage — 首页菜品浏览

**Files:**
- Create: `src/pages/HomePage.tsx`

- [ ] **Step 1: 创建 HomePage**

```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import type { Dish, Category } from '../types'
import CategoryTabs from '../components/CategoryTabs'
import DishCard from '../components/DishCard'
import BottomBar from '../components/BottomBar'

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const { addItem } = useCart()
  const { profile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  useEffect(() => {
    let query = supabase.from('dishes').select('*, category:categories(*)')
    if (activeCategory !== null) {
      query = query.eq('category_id', activeCategory)
    }
    query.order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setDishes(data)
    })
  }, [activeCategory])

  return (
    <div className="pb-4">
      <CategoryTabs
        categories={categories}
        activeId={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="px-4">
        {profile?.role === 'self' && (
          <button
            onClick={() => navigate('/admin')}
            className="text-xs text-gray-400 mb-2 flex items-center gap-1"
          >
            ⚙️ 管理菜品
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          {dishes.map(dish => (
            <DishCard key={dish.id} dish={dish} onAdd={addItem} />
          ))}
        </div>

        {dishes.length === 0 && (
          <p className="text-center text-gray-400 py-12">还没有菜品，去管理后台添加吧</p>
        )}
      </div>

      <BottomBar />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/HomePage.tsx && git commit -m "feat: add HomePage with dish browsing"
```

---

### Task 12: CartPage — 我的餐桌

**Files:**
- Create: `src/pages/CartPage.tsx`, `src/components/CartItem.tsx`

- [ ] **Step 1: 创建 CartItem 组件 (src/components/CartItem.tsx)**

```typescript
import type { CartItem } from '../types'

interface Props {
  item: CartItem
  onUpdateQuantity: (dishId: number, quantity: number) => void
  onRemove: (dishId: number) => void
}

export default function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
  const { dish, quantity } = item

  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-white rounded-xl">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {dish.image_url ? (
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{dish.name}</h3>
        <p className="text-xs text-gray-500 truncate">{dish.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(dish.id, quantity - 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 active:bg-gray-100"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(dish.id, quantity + 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 active:bg-gray-100"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onRemove(dish.id)}
        className="text-gray-300 hover:text-red-400 text-lg px-1"
      >
        ×
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 创建 CartPage (src/pages/CartPage.tsx)**

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartItemRow from '../components/CartItem'
import OrderConfirmModal from '../components/OrderConfirmModal'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirm = () => {
    // Order creation is handled in OrderConfirmModal
    setShowConfirm(false)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-5xl mb-4">🛒</span>
        <p>餐桌上还没有菜品</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-orange-500 underline"
        >
          去挑选菜品
        </button>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="flex flex-col gap-2 p-4">
        {items.map(item => (
          <CartItemRow
            key={item.dish.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">
              共 <span className="font-bold text-orange-500">{items.reduce((s, i) => s + i.quantity, 0)}</span> 道菜
            </span>
            <span className="text-xs text-gray-400">下单人：{profile?.name}</span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg active:bg-orange-600"
          >
            确认下单
          </button>
        </div>
      </div>

      {showConfirm && (
        <OrderConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirmed={() => { setShowConfirm(false); }}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CartItemRow.tsx src/pages/CartPage.tsx && git commit -m "feat: add CartPage with cart item management"
```

---

### Task 13: OrderConfirmModal — 下单确认弹窗

**Files:**
- Create: `src/components/OrderConfirmModal.tsx`

- [ ] **Step 1: 创建 OrderConfirmModal**

```typescript
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Props {
  onCancel: () => void
  onConfirmed: () => void
}

export default function OrderConfirmModal({ onCancel, onConfirmed }: Props) {
  const { items, clearCart } = useCart()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const handleConfirm = async () => {
    if (!profile) return

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ profile_id: profile.id })
      .select('id')
      .single()

    if (orderError || !order) {
      alert('下单失败，请重试')
      return
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      dish_id: item.dish.id,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      alert('下单失败，请重试')
      return
    }

    clearCart()
    onConfirmed()
    navigate(`/orders/${order.id}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-lg p-6 animate-slide-up">
        <h2 className="text-xl font-bold text-center mb-4">📋 确认下单</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          下单人：<span className="font-semibold text-gray-700">{profile?.name}</span>
        </p>

        <div className="divide-y border-t border-b mb-4">
          {items.map(item => (
            <div key={item.dish.id} className="flex justify-between py-2 px-2">
              <span className="text-gray-700">{item.dish.name}</span>
              <span className="text-gray-500">× {item.quantity}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 mb-4">
          共 <span className="font-bold text-orange-500 text-lg">{items.reduce((s, i) => s + i.quantity, 0)}</span> 道菜
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold active:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold active:bg-orange-600"
          >
            确认下单
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/OrderConfirmModal.tsx && git commit -m "feat: add OrderConfirmModal for order confirmation"
```

---

### Task 14: OrderDetailPage — 订单详情

**Files:**
- Create: `src/pages/OrderDetailPage.tsx`

- [ ] **Step 1: 创建 OrderDetailPage**

```typescript
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Order } from '../types'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from('orders')
      .select('*, items:order_items(*, dish:dishes(*)), profile:profiles(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => { if (data) setOrder(data) })
  }, [id])

  if (!order) {
    return <div className="p-8 text-center text-gray-400">加载中...</div>
  }

  const totalCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-center mb-1">📋 订单详情</h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          {new Date(order.created_at).toLocaleString('zh-CN')}
        </p>
        <p className="text-sm text-gray-500 text-center mb-4">
          下单人：<span className="font-semibold text-gray-700">{order.profile?.name}</span>
        </p>

        <div className="divide-y">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between items-center py-3">
              <div>
                <span className="font-medium text-gray-800">{item.dish?.name}</span>
                {item.dish?.description && (
                  <p className="text-xs text-gray-400">{item.dish.description}</p>
                )}
              </div>
              <span className="text-orange-500 font-semibold">× {item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 text-center">
          <p className="text-gray-600">
            共 <span className="font-bold text-orange-500 text-xl">{totalCount}</span> 道菜
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/OrderDetailPage.tsx && git commit -m "feat: add OrderDetailPage"
```

---

### Task 15: OrderHistoryPage — 历史订单

**Files:**
- Create: `src/pages/OrderHistoryPage.tsx`

- [ ] **Step 1: 创建 OrderHistoryPage**

```typescript
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Order } from '../types'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filterProfile, setFilterProfile] = useState<string | null>(null)
  const { profile, profiles } = useAuth()

  useEffect(() => {
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*), profile:profiles(*)')
      .order('created_at', { ascending: false })

    if (filterProfile) {
      query = query.eq('profile_id', filterProfile)
    }

    query.then(({ data }) => { if (data) setOrders(data) })
  }, [filterProfile])

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setFilterProfile(null)}
          className={`shrink-0 px-3 py-1 rounded-full text-sm ${
            filterProfile === null
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 border'
          }`}
        >
          全部
        </button>
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => setFilterProfile(p.id)}
            className={`shrink-0 px-3 py-1 rounded-full text-sm ${
              filterProfile === p.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-12">暂无订单</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="bg-white rounded-xl p-4 shadow-sm active:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-800">
                    {order.profile?.name} 的订单
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-orange-500 font-bold">
                    {order.items?.reduce((s, i) => s + i.quantity, 0)} 道菜
                  </span>
                  <p className="text-xs text-gray-400">&rarr;</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/OrderHistoryPage.tsx && git commit -m "feat: add OrderHistoryPage"
```

---

### Task 16: ImageUpload 组件

**Files:**
- Create: `src/components/ImageUpload.tsx`

- [ ] **Step 1: 创建 ImageUpload**

```typescript
import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  imageUrl: string
  onChange: (url: string) => void
}

export default function ImageUpload({ imageUrl, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from('dishes')
      .upload(fileName, file)

    if (error) {
      alert('上传失败')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('dishes')
      .getPublicUrl(fileName)

    onChange(publicUrl)
    setUploading(false)
  }

  return (
    <div
      onClick={() => fileRef.current?.click()}
      className="w-full aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden cursor-pointer"
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <span className="text-3xl">📷</span>
          <span className="text-sm mt-1">{uploading ? '上传中...' : '点击上传图片'}</span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ImageUpload.tsx && git commit -m "feat: add ImageUpload component"
```

---

### Task 17: DishManagePage — 管理后台（菜品管理）

**Files:**
- Create: `src/pages/admin/DishManagePage.tsx`

- [ ] **Step 1: 创建 DishManagePage**

```typescript
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Dish, Category } from '../../types'
import ImageUpload from '../../components/ImageUpload'

export default function DishManagePage() {
  const { profile } = useAuth()
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null)

  // Load dishes and categories
  const loadDishes = () => {
    supabase
      .from('dishes')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setDishes(data) })
  }

  useEffect(() => {
    loadDishes()
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  // Redirect non-self users
  if (profile?.role !== 'self') {
    return <div className="p-8 text-center text-gray-400">无权限访问</div>
  }

  const handleSave = async () => {
    if (!editingDish?.name) return

    const dishData = {
      name: editingDish.name,
      description: editingDish.description || '',
      cook_time: editingDish.cook_time || '',
      image_url: editingDish.image_url || '',
      category_id: editingDish.category_id || null,
    }

    if (editingDish.id) {
      await supabase.from('dishes').update(dishData).eq('id', editingDish.id)
    } else {
      await supabase.from('dishes').insert(dishData)
    }

    setShowForm(false)
    setEditingDish(null)
    loadDishes()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这道菜？')) return
    await supabase.from('dishes').delete().eq('id', id)
    loadDishes()
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">菜品管理</h2>
        <Link to="/admin/categories" className="text-sm text-orange-500">
          管理分类 &rarr;
        </Link>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingDish?.id ? '编辑菜品' : '添加菜品'}
            </h3>

            <ImageUpload
              imageUrl={editingDish?.image_url || ''}
              onChange={(url) => setEditingDish(prev => ({ ...prev, image_url: url }))}
            />

            <input
              className="w-full border rounded-lg px-3 py-2 mt-3 text-sm"
              placeholder="菜品名称 *"
              value={editingDish?.name || ''}
              onChange={e => setEditingDish(prev => ({ ...prev, name: e.target.value }))}
            />

            <input
              className="w-full border rounded-lg px-3 py-2 mt-2 text-sm"
              placeholder="一句话简介"
              value={editingDish?.description || ''}
              onChange={e => setEditingDish(prev => ({ ...prev, description: e.target.value }))}
            />

            <input
              className="w-full border rounded-lg px-3 py-2 mt-2 text-sm"
              placeholder="烹饪时间，如：30分钟"
              value={editingDish?.cook_time || ''}
              onChange={e => setEditingDish(prev => ({ ...prev, cook_time: e.target.value }))}
            />

            <select
              className="w-full border rounded-lg px-3 py-2 mt-2 text-sm bg-white"
              value={editingDish?.category_id || ''}
              onChange={e => setEditingDish(prev => ({ ...prev, category_id: Number(e.target.value) || undefined }))}
            >
              <option value="">选择分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowForm(false); setEditingDish(null); }}
                className="flex-1 py-3 border rounded-xl text-gray-600"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {dishes.map(dish => (
          <div key={dish.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              {dish.image_url ? (
                <img src={dish.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{dish.name}</p>
              <p className="text-xs text-gray-400">
                {dish.category?.name} · {dish.cook_time}
              </p>
            </div>
            <button
              onClick={() => { setEditingDish(dish); setShowForm(true); }}
              className="text-sm text-orange-500 px-2"
            >
              编辑
            </button>
            <button
              onClick={() => handleDelete(dish.id)}
              className="text-sm text-red-400 px-2"
            >
              删除
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => { setEditingDish({}); setShowForm(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white text-2xl rounded-full shadow-lg active:bg-orange-600 flex items-center justify-center z-10"
      >
        +
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/DishManagePage.tsx && git commit -m "feat: add DishManagePage for admin"
```

---

### Task 18: CategoryManagePage — 管理后台（分类管理）

**Files:**
- Create: `src/pages/admin/CategoryManagePage.tsx`

- [ ] **Step 1: 创建 CategoryManagePage**

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Category } from '../../types'

export default function CategoryManagePage() {
  const { profile } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  const loadCategories = () => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => { if (data) setCategories(data) })
  }

  useEffect(() => { loadCategories() }, [])

  if (profile?.role !== 'self') {
    return <div className="p-8 text-center text-gray-400">无权限访问</div>
  }

  const handleAdd = async () => {
    if (!newName.trim()) return
    const maxOrder = Math.max(0, ...categories.map(c => c.sort_order))
    await supabase.from('categories').insert({ name: newName.trim(), sort_order: maxOrder + 1 })
    setNewName('')
    loadCategories()
  }

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return
    await supabase.from('categories').update({ name: editingName.trim() }).eq('id', id)
    setEditingId(null)
    loadCategories()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('删除分类后，该分类下的菜品将变为未分类。确定删除？')) return
    await supabase.from('categories').delete().eq('id', id)
    loadCategories()
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">分类管理</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="新分类名称"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          添加
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-2 bg-white rounded-xl p-3">
            {editingId === cat.id ? (
              <>
                <input
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                  autoFocus
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="text-sm text-orange-500 px-2"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-gray-400 px-2"
                >
                  取消
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium text-gray-800">{cat.name}</span>
                <button
                  onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                  className="text-sm text-orange-500 px-2"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-sm text-red-400 px-2"
                >
                  删除
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/CategoryManagePage.tsx && git commit -m "feat: add CategoryManagePage for admin"
```

---

### Task 19: 修复编译错误 & 完整性检查

**Files:**
- Modify: `src/App.tsx`, 各种导入路径

- [ ] **Step 1: 确保所有导入路径正确，运行编译检查**

```bash
npx tsc --noEmit
```

Expected: 0 errors。如果有错误，逐一修复导入路径和类型不匹配问题。

- [ ] **Step 2: 运行 dev server 确认所有页面能正常渲染**

```bash
npm run dev
```

手动验证：
- `/login` 能看到两个用户选择按钮
- 选用户后 `/` 能看到首页（即使没有数据也要能正常渲染）
- `/cart` 能看到空购物车状态
- `/orders` 能看到空订单状态
- `/admin` 能看到菜品管理页
- `/admin/categories` 能看到分类管理页

- [ ] **Step 3: Commit 所有修复**

```bash
git add -A && git commit -m "fix: resolve compilation errors and import paths"
```

---

### Task 20: 部署到 Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: 创建 vercel.json**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: 部署到 Vercel**

```bash
npx vercel --prod
```

按提示操作：
1. 登录 Vercel（首次使用需要邮箱验证）
2. 确认项目设置
3. 部署完成后会得到网址，如 `https://family-cooking.vercel.app`

- [ ] **Step 3: 在 Vercel Dashboard 中设置环境变量**

```
VITE_SUPABASE_URL = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
```

然后重新部署：
```bash
npx vercel --prod
```

- [ ] **Step 4: Commit**

```bash
git add vercel.json && git commit -m "feat: add Vercel deployment config"
```

---

### Task 21: 最终验证 & PWA 测试

- [ ] **Step 1: 手机浏览器打开部署网址**

确认所有功能正常：
- 用户选择 → 首页浏览 → 添加菜品到餐桌 → 下单 → 查看订单

- [ ] **Step 2: 测试 PWA 安装**

手机浏览器 → 菜单 → 「添加到主屏幕」→ 从主屏幕图标打开 → 确认全屏体验

- [ ] **Step 3: 在管理后台添加几个菜品的真实数据**

通过 `/admin` 页面上传菜品图片、填写信息。

---

## 附录：Supabase 设置步骤

1. 到 [supabase.com](https://supabase.com) 用 GitHub 账号注册
2. 创建新项目，记下 project URL 和 anon key
3. SQL Editor → 执行 `supabase/schema.sql`
4. Storage → 新建名为 `dishes` 的 bucket，设为 public
5. 将 project URL 和 anon key 填入 `.env` 文件
