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
