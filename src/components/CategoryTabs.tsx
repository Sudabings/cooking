import type { Category } from '../types'

interface Props {
  categories: Category[]
  activeId: number | null
  onChange: (id: number | null) => void
}

export default function CategoryTabs({ categories, activeId, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3">
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
