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