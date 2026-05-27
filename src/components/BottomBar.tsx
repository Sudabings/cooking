import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function BottomBar() {
  const { totalCount } = useCart()
  const { profile } = useAuth()
  const navigate = useNavigate()

  if (totalCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-20">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3" onClick={() => navigate('/cart')}>
          <span className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          </span>
          <span className="text-sm text-gray-500">
            {profile?.name} 的餐桌
          </span>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold text-sm active:bg-orange-600"
        >
          去下单
        </button>
      </div>
    </div>
  )
}
