import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar({ onCartOpen, onAuthOpen, onSearch, onOrdersOpen, onSellerOpen, darkMode, toggleDark }) {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const [q, setQ] = useState('')

  const handleSearch = (e) => { e.preventDefault(); onSearch(q) }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <a href="/" className="flex items-center gap-0.5 shrink-0">
          <span className="font-syne font-extrabold text-xl text-neutral-900 dark:text-white tracking-tight">Nexova</span>
          <span className="text-brand-500 font-extrabold text-2xl leading-none">.</span>
        </a>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex items-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <input className="flex-1 px-4 py-2.5 bg-transparent outline-none text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
            placeholder="Search products, brands..." value={q} onChange={e => setQ(e.target.value)} />
          <button type="submit" className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">Search</button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleDark} className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center hover:border-brand-500 transition-all text-lg" title="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Seller Dashboard button — always visible */}
          <button onClick={onSellerOpen}
            className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-brand-500 hover:text-brand-500 transition-all font-medium"
            title="Seller Dashboard">
            🏪 <span>Sell</span>
          </button>

          {user && (
            <button onClick={onOrdersOpen}
              className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-brand-500 hover:text-brand-500 transition-all font-medium">
              📦 <span>Orders</span>
            </button>
          )}

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Hi, <span className="font-semibold text-neutral-800 dark:text-white">{user}</span></span>
              <button onClick={logout} className="text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-red-400 hover:text-red-500 transition-all">Logout</button>
            </div>
          ) : (