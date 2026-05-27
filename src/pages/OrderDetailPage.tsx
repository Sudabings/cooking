import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Order } from '../types'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from('orders')
      .select('*, items:order_items(*, dish:dishes(*)), profile:profiles(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => { if (data) setOrder(data) })
  }, [id])

  if (!order) {
    return <div className="p-8 text-center text-gray-400">加载中...</div>
  }

  const totalCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-center mb-1">📋 订单详情</h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          {new Date(order.created_at).toLocaleString('zh-CN')}
        </p>
        <p className="text-sm text-gray-500 text-center mb-4">
          下单人：<span className="font-semibold text-gray-700">{order.profile?.name}</span>
        </p>

        <div className="divide-y">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between items-center py-3">
              <div>
                <span className="font-medium text-gray-800">{item.dish?.name}</span>
                {item.dish?.description && (
                  <p className="text-xs text-gray-400">{item.dish.description}</p>
                )}
              </div>
              <span className="text-orange-500 font-semibold">× {item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 text-center">
          <p className="text-gray-600">
            共 <span className="font-bold text-orange-500 text-xl">{totalCount}</span> 道菜
          </p>
        </div>
      </div>
    </div>
  )
}
