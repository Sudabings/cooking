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
