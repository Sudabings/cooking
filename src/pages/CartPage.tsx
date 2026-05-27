import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartItemRow from '../components/CartItem'
import OrderConfirmModal from '../components/OrderConfirmModal'

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

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
