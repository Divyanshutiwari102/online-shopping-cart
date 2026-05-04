import { useState } from 'react'
import { getOrderByNumber, getAllOrders, cancelOrder } from '../../services/api'

const STATUS_STEPS = [
  { key: 'CONFIRMED',   label: 'Order Confirmed', icon: '✓', desc: 'Your order has been placed' },
  { key: 'PROCESSING',  label: 'Processing',       icon: '⚙', desc: 'Order is being prepared' },
  { key: 'SHIPPED',     label: 'Shipped',          icon: '📦', desc: 'Out for delivery' },
  { key: 'DELIVERED',   label: 'Delivered',        icon: '🏠', desc: 'Delivered successfully' },
]

const STATUS_BADGE = {
  CONFIRMED:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PROCESSING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  SHIPPED:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DELIVERED:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CANCELLED:  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

export default function OrderTracker({ onClose }) {
  const [tab, setTab] = useState('track')
  const [orderNum, setOrderNum] = useState('')
  const [order, setOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [err, setErr] = useState('')

  const handleTrack = async () => {
    if (!orderNum.trim()) { setErr('Enter order number'); return }
    setLoading(true); setErr(''); setOrder(null)
    try {
      const { data } = await getOrderByNumber(orderNum.trim())
      setOrder(data)
    } catch {
      setErr('Order not found. Check your order number.')
    }
    setLoading(false)
  }

  const handleHistory = async () => {
    setTab('history'); setLoading(true)
    try {
      const { data } = await getAllOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      setOrders([])
    }
    setLoading(false)
  }