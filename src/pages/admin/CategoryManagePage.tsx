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
