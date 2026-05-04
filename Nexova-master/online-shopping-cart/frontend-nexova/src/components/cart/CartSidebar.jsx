import { useState, useEffect } from 'react'
import { fetchProductImage } from '../../utils/imageHelper'
import { useCart } from '../../context/CartContext'

function CartItem({ item, onRemove }) {
  const [imgUrl, setImgUrl] = useState(`https://picsum.photos/seed/nexova${item.id}/80/80`)

  useEffect(() => {
    fetchProductImage(item, 'small').then(url => setImgUrl(url))
  }, [item.id])

  return (
    <li className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
        <img
          src={imgUrl}
          alt={item.productName}
          onError={() => setImgUrl(`https://picsum.photos/seed/nexova${item.id}/80/80`)}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">{item.productBrand}</div>
        <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{item.productName}</div>
        <div className="font-syne font-bold text-brand-500">${item.productPrice?.toLocaleString()}</div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm shrink-0"
      >
        ✕
      </button>
    </li>
  )
}

export default function CartSidebar({ open, onClose, onCheckout }) {
  const { cart, cartTotal, removeItem } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <h2 className="font-syne font-bold text-lg text-neutral-900 dark:text-white">
            Cart <span className="font-normal text-neutral-400 text-base">({cart.length})</span>
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-syne font-bold text-lg text-neutral-800 dark:text-neutral-200 mb-1">Cart is empty</h3>
              <p className="text-sm text-neutral-400">Add some products to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map(item => (
                <CartItem key={item.id} item={item} onRemove={removeItem} />
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Subtotal</span>
              <span className="font-syne font-bold text-xl text-neutral-900 dark:text-white">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Proceed to Checkout →
            </button>
            <p className="text-[11px] text-center text-neutral-400">🔒 Secure checkout · Free returns</p>
          </div>
        )}
      </div>
    </>
  )
}
