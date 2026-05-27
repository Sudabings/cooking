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
