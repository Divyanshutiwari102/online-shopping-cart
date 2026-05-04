import { useState, useEffect } from 'react'
import { fetchProductImage } from '../../utils/imageHelper'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { addFavorite, removeFavorite } from '../../services/api'

export default function ProductModal({ product, onClose, onAuthRequired }) {
  const { addItem, cart } = useCart()
  const { success, error } = useToast()
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [liked, setLiked] = useState(false)
  const [imgUrl, setImgUrl] = useState(`https://picsum.photos/seed/nexova${product?.id}/600/600`)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (!product) return
    fetchProductImage(product, 'large').then(url => setImgUrl(url))
  }, [product?.id])

  if (!product) return null
  const inCart = cart.some(i => i.id === product.id)

  const handleAdd = async () => {
    if (!user) { onClose(); onAuthRequired?.(); return }
    setAdding(true)
    const result = await addItem(product.id, product)
    if (result.success) success(`${product.productName} added to cart!`)
    else error('Failed to add to cart')
    setAdding(false)
  }

  const handleFavorite = async () => {
    if (!user) { onClose(); onAuthRequired?.(); return }
    try { liked ? await removeFavorite(product.id) : await addFavorite(product.id) } catch {}
    setLiked(!liked)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-up">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-72 aspect-square sm:aspect-auto bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 relative">
            {!imgLoaded && <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />}
            <img src={imgUrl} alt={product.productName} onLoad={() => setImgLoaded(true)} onError={() => setImgUrl(`https://picsum.photos/seed/nexova${product.id}/600/600`)} className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">{product.productBrand}</span>
                <h2 className="font-syne font-bold text-xl text-neutral-900 dark:text-white mt-1 leading-tight">{product.productName}</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-neutral-800 dark:hover:text-white flex items-center justify-center ml-3 shrink-0">✕</button>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 flex-1">{product.productDetails || 'No description available.'}</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                <div className="text-xs text-neutral-400 mb-1">Price</div>
                <div className="font-syne font-bold text-2xl text-brand-500">${product.productPrice?.toLocaleString()}</div>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                <div className="text-xs text-neutral-400 mb-1">Stock</div>
                <div className={`font-bold text-sm ${product.stock > 5 ? 'text-green-600 dark:text-green-400' : 'text-amber-500'}`}>
                  {product.stock > 5 ? `✓ ${product.stock} available` : `⚠ Only ${product.stock} left`}
                </div>
              </div>
            </div>
            {product.seller && (
              <div className="flex items-center gap-2 mb-4 p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold text-xs flex items-center justify-center">{product.seller.name?.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{product.seller.name}</div>
                  <div className="text-[10px] text-neutral-400">Verified Seller</div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={adding || inCart || !product.stock} className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${inCart ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default' : 'bg-brand-500 hover:bg-brand-600 text-white active:scale-95'}`}>
                {adding ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" /> Adding...</>
                  : inCart ? '✓ Added to Cart'
                  : !product.stock ? 'Out of Stock'
                  : !user ? '🔒 Login to Add'
                  : '+ Add to Cart'}
              </button>
              <button onClick={handleFavorite} className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg transition-all ${liked ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-brand-500'}`}>
                {liked ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
