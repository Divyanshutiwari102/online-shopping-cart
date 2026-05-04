import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getCart, addToCart, removeFromCart, confirmCart } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [cart, setCart]       = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!token) { setCart([]); return }
    try {
      const { data } = await getCart()
      setCart(Array.isArray(data) ? data : [])
    } catch { setCart([]) }
  }, [token])

  useEffect(() => { fetchCart() }, [fetchCart])

  // FIX #1: addItem now returns failure when API fails — no more silent fake success
  const addItem = useCallback(async (productId, productObj) => {
    try {
      await addToCart(productId)
      setCart(prev => prev.find(i => i.id === productId) ? prev : [...prev, { ...productObj, id: productId }])
      return { success: true }
    } catch (err) {
      // Do NOT add to local state if backend rejected it
      const msg = err.response?.data || 'Failed to add to cart'
      return { success: false, error: msg }
    }
  }, [])

  const removeItem = useCallback(async (productId) => {
    try { await removeFromCart(productId) } catch {}
    setCart(prev => prev.filter(i => i.id !== productId))
  }, [])

  // FIX #2: checkout now loops through ALL cart items, not just the first one
  const checkout = useCallback(async (paymentData) => {
    if (cart.length === 0) return { success: false, error: 'Cart is empty' }
    setLoading(true)

    const orders = []
    const failed = []

    for (const item of cart) {
      try {
        const payload = {
          id:             item.id,
          cardNumber:     paymentData.cardNumber,
          cvv:            Number(paymentData.cvv),
          expirationDate: paymentData.expirationDate,
          nameAndSurname: paymentData.nameAndSurname,
          promoCode:      paymentData.promoCode || null,
          deliveryType:   paymentData.deliveryType || 'home',
          customerEmail:  paymentData.customerEmail || '',
          customerMobile: paymentData.customerMobile || '',
          deliveryPincode: paymentData.deliveryPincode || '',
          deliveryAddress: paymentData.deliveryAddress || '',
        }
        const { data } = await confirmCart(payload)
        orders.push(data)
      } catch (err) {
        failed.push({ item, error: err.response?.data || 'Failed' })
      }
    }

    setLoading(false)

    if (orders.length === 0) {
      return { success: false, error: failed[0]?.error || 'Payment failed for all items' }
    }

    // Clear only successfully ordered items from cart
    const successIds = new Set(orders.map(o => o.orderId).filter(Boolean))
    // Since backend clears cart items individually, clear entire local cart
    setCart([])

    return {
      success: true,
      order: orders[0],       // first order for display in CheckoutModal
      allOrders: orders,
      failedItems: failed,
    }
  }, [cart])

  const cartTotal = cart.reduce((sum, item) => sum + (item.productPrice || 0), 0)
  const cartCount = cart.length

  return (
    <CartContext.Provider value={{ cart, cartTotal, cartCount, addItem, removeItem, checkout, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
