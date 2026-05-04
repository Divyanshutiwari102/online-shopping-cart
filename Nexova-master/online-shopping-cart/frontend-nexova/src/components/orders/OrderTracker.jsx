import { useState } from 'react'
import { getOrderByNumber, getAllOrders, cancelOrder } from '../../services/api'

const STATUS_STEPS = [
  { key: 'CONFIRMED',  label: 'Order Confirmed', icon: '✓', desc: 'Your order has been placed' },
  { key: 'PROCESSING', label: 'Processing',      icon: '⚙', desc: 'Order is being prepared' },
  { key: 'SHIPPED',    label: 'Shipped',         icon: '📦', desc: 'Out for delivery' },
  { key: 'DELIVERED',  label: 'Delivered',       icon: '🏠', desc: 'Delivered successfully' },
]

const STATUS_BADGE = {
  CONFIRMED:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PROCESSING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  SHIPPED:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DELIVERED:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CANCELLED:  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

export default function OrderTracker({ onClose }) {
  const [tab, setTab]                 = useState('track')
  const [orderNum, setOrderNum]       = useState('')
  const [order, setOrder]             = useState(null)
  const [orders, setOrders]           = useState([])
  const [loading, setLoading]         = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [err, setErr]                 = useState('')

  const handleTrack = async (numOverride) => {
    const num = (numOverride ?? orderNum).toString().trim()
    if (!num) { setErr('Enter order number'); return }
    setLoading(true); setErr(''); setOrder(null)
    try {
      const { data } = await getOrderByNumber(num)
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

  const handleCancel = async (orderNumber, onSuccess) => {
    if (!window.confirm(`Cancel order #${orderNumber}?\n\nStock will be restored and you will receive a confirmation email.`)) return
    setCancellingId(orderNumber)
    try {
      await cancelOrder(orderNumber)
      onSuccess()
    } catch (e) {
      alert(e?.response?.data || 'Could not cancel this order. Please try again.')
    }
    setCancellingId(null)
  }

  // FIX: auto-trigger track when clicking "Track →" from history tab
  const handleTrackFromHistory = (num) => {
    setTab('track')
    setOrderNum(String(num))
    handleTrack(num)   // pass directly so we don't wait for state update
  }

  const canCancel = (status) =>
    status && !['DELIVERED', 'CANCELLED'].includes(status.toUpperCase())

  const currentStep = order
    ? Math.max(0, STATUS_STEPS.findIndex(s => s.key === order.orderStatus?.toUpperCase()))
    : -1

  const isCancelled = order?.orderStatus?.toUpperCase() === 'CANCELLED'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="font-syne font-extrabold text-xl text-neutral-900 dark:text-white">📦 Order Tracking</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-800 dark:hover:text-white text-sm"
          >✕</button>
        </div>

        {/* Tabs */}
        <div className="flex bg-neutral-50 dark:bg-neutral-900 p-1 mx-6 mt-4 rounded-xl">
          <button
            onClick={() => setTab('track')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'track' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500'}`}
          >Track Order</button>
          <button
            onClick={handleHistory}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'history' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500'}`}
          >Order History</button>
        </div>

        <div className="px-6 py-5">

          {/* TRACK TAB */}
          {tab === 'track' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
                  placeholder="Enter order number..."
                  value={orderNum}
                  onChange={e => setOrderNum(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTrack()}
                />
                <button
                  onClick={() => handleTrack()}
                  disabled={loading}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow inline-block" />
                    : 'Track'}
                </button>
              </div>

              {err && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">{err}</p>}

              {order && (
                <div className="space-y-4 pt-2">
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Order #</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Product</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 max-w-[200px] text-right truncate">{order.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Amount</span>
                      <span className="font-bold text-brand-500">${order.productPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Status</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[order.orderStatus?.toUpperCase()] || STATUS_BADGE.CONFIRMED}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment</span>
                      <span className="font-semibold text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {!isCancelled ? (
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Delivery Status</p>
                      <div className="space-y-0">
                        {STATUS_STEPS.map((s, i) => {
                          const isActive = i === currentStep
                          const isDone   = i < currentStep
                          return (
                            <div key={s.key} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                                  ${isDone   ? 'bg-brand-500 border-brand-500 text-white'
                                  : isActive ? 'border-brand-500 text-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                  :            'border-neutral-300 dark:border-neutral-600 text-neutral-400'}`}>
                                  {isDone ? '✓' : s.icon}
                                </div>
                                {i < STATUS_STEPS.length - 1 && (
                                  <div className={`w-0.5 h-8 ${isDone ? 'bg-brand-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                                )}
                              </div>
                              <div className={`pb-6 ${i === STATUS_STEPS.length - 1 ? 'pb-0' : ''}`}>
                                <p className={`text-sm font-semibold ${isActive ? 'text-brand-500' : isDone ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}`}>{s.label}</p>
                                <p className="text-xs text-neutral-400 mt-0.5">{s.desc}</p>
                                {isActive && <span className="inline-flex items-center gap-1 text-[10px] bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full mt-1 font-semibold">● Live</span>}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">❌</div>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">This order has been cancelled</p>
                      <p className="text-xs text-neutral-400 mt-1">Stock has been restored. Check your email for details.</p>
                    </div>
                  )}

                  {canCancel(order.orderStatus) && (
                    <button
                      onClick={() => handleCancel(order.orderNumber, () => setOrder(prev => ({ ...prev, orderStatus: 'CANCELLED' })))}
                      disabled={cancellingId === order.orderNumber}
                      className="w-full py-2.5 border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {cancellingId === order.orderNumber
                        ? <><span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin-slow" /> Cancelling...</>
                        : '✕ Cancel Order'}
                    </button>
                  )}
                </div>
              )}

              {!order && !loading && !err && (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">📬</div>
                  <p className="text-sm text-neutral-400">Enter your order number from the confirmation email</p>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <span className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin-slow inline-block" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-sm text-neutral-400">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {orders.map(o => (
                    <div key={o.id} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 text-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-neutral-900 dark:text-white">#{o.orderNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[o.orderStatus?.toUpperCase()] || STATUS_BADGE.CONFIRMED}`}>
                          {o.orderStatus || 'CONFIRMED'}
                        </span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 truncate mb-2">{o.productName}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-brand-500">${o.productPrice}</span>
                        <div className="flex items-center gap-3">
                          {canCancel(o.orderStatus) && (
                            <button
                              onClick={() => handleCancel(o.orderNumber, () => {
                                setOrders(prev => prev.map(x => x.id === o.id ? { ...x, orderStatus: 'CANCELLED' } : x))
                              })}
                              disabled={cancellingId === o.orderNumber}
                              className="text-xs text-red-500 hover:underline disabled:opacity-60 font-medium"
                            >
                              {cancellingId === o.orderNumber ? 'Cancelling...' : 'Cancel ✕'}
                            </button>
                          )}
                          {/* FIX: now auto-triggers track instead of just setting input */}
                          <button
                            onClick={() => handleTrackFromHistory(o.orderNumber)}
                            className="text-xs text-brand-500 hover:underline font-medium"
                          >Track →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
