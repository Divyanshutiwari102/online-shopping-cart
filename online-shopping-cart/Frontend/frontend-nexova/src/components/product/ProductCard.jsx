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