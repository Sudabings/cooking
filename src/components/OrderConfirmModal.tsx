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

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ profile_id: profile.id })
      .select('id')
      .single()

    if (orderError || !order) {
      alert('下单失败，请重试')
      return
    }

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
      <div className="bg-white rounded-t-2xl w-full max-w-lg p-6">
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
