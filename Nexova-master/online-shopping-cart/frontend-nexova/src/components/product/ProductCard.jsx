import { useState, useEffect } from 'react'
import { fetchProductImage } from '../../utils/imageHelper'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { addFavorite } from '../../services/api'

export default function ProductCard({ product, onClick, onAuthRequired }) {
  const { addItem, cart } = useCart()
  const { success, error } = useToast()
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [liked, setLiked] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(product.favoriteNumber || 0)
  const [imgUrl, setImgUrl] = useState(`https://picsum.photos/seed/nexova${product.id}/400/400`)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    fetchProductImage(product, 'medium').then(url => setImgUrl(url))
  }, [product.id])

  const inCart = cart.some(i => i.id === product.id)

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!user) { onAuthRequired?.(); return }
    if (inCart) return
    setAdding(true)
    const result = await addItem(product.id, product)
    if (result.success) success(`${product.productName} added to cart!`)
    else error('Failed to add to cart')
    setAdding(false)
  }

  const handleFavorite = async (e) => {
    e.stopPropagation()
    if (!user) { onAuthRequired?.(); return }
    try { await addFavorite(product.id) } catch {}
    setLiked(p => !p)
    setFavoriteCount(p => liked ? p - 1 : p + 1)
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-brand-400 dark:hover:border-brand-500"
    >
      <div className="relative overflow-hidden aspect-square bg-neutral-100 dark:bg-neutral-800">
        {!imgLoaded && <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />}
        <img
          src={imgUrl}
          alt={product.productName}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgUrl(`https://picsum.photos/seed/nexova${product.id}/400/400`)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={adding || inCart}
            className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition-all
              ${inCart ? 'bg-green-600 text-white cursor-default' : 'bg-brand-500 hover:bg-brand-600 text-white'}`}
          >
            {adding ? <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
              : inCart ? '✓ In Cart' : user ? '+ Cart' : '🔒 Login'}
          </button>
        </div>
        <button onClick={handleFavorite} className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm flex items-center justify-center text-sm shadow hover:scale-110 transition-transform">
          {liked ? '❤️' : '🤍'}
        </button>
        {product.stock > 0 && product.stock <= 3 && (
          <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Only {product.stock} left!</span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[11px] font-bold text-brand-500 uppercase tracking-wider mb-1">{product.productBrand || 'Generic'}</div>
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mb-1 leading-snug line-clamp-2">{product.productName}</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3 line-clamp-1">{product.productDetails || 'High quality product'}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-syne font-bold text-lg text-brand-500">${product.productPrice?.toLocaleString()}</div>
            <div className={`text-[10px] font-semibold mt-0.5 ${product.stock > 5 ? 'text-green-600 dark:text-green-400' : 'text-amber-500'}`}>
              {product.stock > 5 ? `${product.stock} in stock` : `⚠ ${product.stock} left`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">♥ {favoriteCount}</span>
            <button
              onClick={handleAddToCart}
              disabled={adding || inCart}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                ${inCart ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                  : 'bg-brand-500 hover:bg-brand-600 text-white hover:scale-105 active:scale-95'}`}
            >
              {adding ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                : inCart ? '✓' : user ? '+' : '🔒'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
