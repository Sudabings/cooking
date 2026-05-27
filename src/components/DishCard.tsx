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
