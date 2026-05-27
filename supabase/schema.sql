-- 用户表
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('self', 'family'))
);

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

-- RLS policies (allow all for private use)
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
