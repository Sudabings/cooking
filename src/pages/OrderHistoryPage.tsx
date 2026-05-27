import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Order } from '../types'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filterProfile, setFilterProfile] = useState<string | null>(null)
  const { profiles } = useAuth()

  useEffect(() => {
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*), profile:profiles(*)')
      .order('created_at', { ascending: false })

    if (filterProfile) {
      query = query.eq('profile_id', filterProfile)
    }

    query.then(({ data }) => { if (data) setOrders(data) })
  }, [filterProfile])

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setFilterProfile(null)}
          className={`shrink-0 px-3 py-1 rounded-full text-sm ${
            filterProfile === null
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 border'
          }`}
        >
          全部
        </button>
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => setFilterProfile(p.id)}
            className={`shrink-0 px-3 py-1 rounded-full text-sm ${
              filterProfile === p.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-12">暂无订单</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="bg-white rounded-xl p-4 shadow-sm active:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-800">
                    {order.profile?.name} 的订单
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-orange-500 font-bold">
                    {order.items?.reduce((s, i) => s + i.quantity, 0)} 道菜
                  </span>
                  <p className="text-xs text-gray-400">&rarr;</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
