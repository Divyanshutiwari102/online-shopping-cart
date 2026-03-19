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