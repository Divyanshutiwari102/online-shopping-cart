import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartSidebar from './components/cart/CartSidebar'
import AuthModal from './components/auth/AuthModal'
import CheckoutModal from './components/checkout/CheckoutModal'
import OrderTracker from './components/orders/OrderTracker'
import SellerDashboard from './components/seller/SellerDashboard'
import HomePage from './pages/HomePage'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'

function AppShell() {
  const [cartOpen,     setCartOpen]     = useState(false)
  const [authOpen,     setAuthOpen]     = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [ordersOpen,   setOrdersOpen]   = useState(false)
  const [sellerOpen,   setSellerOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [darkMode,     setDarkMode]     = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexova_theme') === 'dark' ||
        (!localStorage.getItem('nexova_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('nexova_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 font-dm">
      <Navbar
        onCartOpen={()   => setCartOpen(true)}
        onAuthOpen={()   => setAuthOpen(true)}
        onOrdersOpen={() => setOrdersOpen(true)}
        onSellerOpen={() => setSellerOpen(true)}
        onSearch={q      => setSearchQuery(q)}
        darkMode={darkMode}
        toggleDark={()   => setDarkMode(d => !d)}
      />

      <HomePage
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAuthRequired={() => setAuthOpen(true)}
      />

      <Footer />

      <CartSidebar
        open={cartOpen}
        onClose={()    => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />

      {authOpen     && <AuthModal       onClose={() => setAuthOpen(false)} />}
      {checkoutOpen && <CheckoutModal   onClose={() => setCheckoutOpen(false)} onSuccess={() => {}} />}
      {ordersOpen   && <OrderTracker    onClose={() => setOrdersOpen(false)} />}
      {sellerOpen   && <SellerDashboard onClose={() => setSellerOpen(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
