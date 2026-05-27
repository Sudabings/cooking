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
