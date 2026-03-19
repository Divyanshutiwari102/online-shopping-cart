import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getCart, addToCart, removeFromCart, confirmCart } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!token) { setCart([]); return }
    try {
      const { data } = await getCart()
      setCart(Array.isArray(data) ? data : [])
    } catch { setCart([]) }
  }, [token])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = useCallback(async (productId, productObj) => {
    try {
      await addToCart(productId)
      setCart(prev => prev.find(i => i.id === productId) ? prev : [...prev, { ...productObj, id: productId }])
      return { success: true }
    } catch {
      setCart(prev => prev.find(i => i.id === productId) ? prev : [...prev, { ...productObj, id: productId }])
      return { success: true }
    }
  }, [])

  const removeItem = useCallback(async (productId) => {
    try { await removeFromCart(productId) } catch {}
    setCart(prev => prev.filter(i => i.id !== productId))
  }, [])

  const checkout = useCallback(async (paymentData) => {
    setLoading(true)
    try {
      const firstItem = cart[0]
      const payload = {
        id: firstItem?.id || 1,
        cardNumber: paymentData.cardNumber,
        cvv: Number(paymentData.cvv),
        expirationDate: paymentData.expirationDate,
        nameAndSurname: paymentData.nameAndSurname,
        promoCode: paymentData.promoCode || null,
        deliveryType: paymentData.deliveryType || 'home',
        // New fields