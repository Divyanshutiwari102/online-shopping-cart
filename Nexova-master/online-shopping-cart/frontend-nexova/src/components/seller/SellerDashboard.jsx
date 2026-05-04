import { useState, useEffect } from 'react'
import { getAllSellers, getAllProducts, addProduct, deleteProduct, updateProductDetails, getAllOrders, updateOrderStatus, addSeller } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { fetchProductImage } from '../../utils/imageHelper'

// ─── Seller Auth stored in localStorage ───────────────────────────
const SELLER_AUTH_KEY = 'nexova_seller_auth'

function getStoredSellerPasswords() {
  try { return JSON.parse(localStorage.getItem(SELLER_AUTH_KEY) || '{}') } catch { return {} }
}
function saveSellerPassword(email, password) {
  const db = getStoredSellerPasswords()
  db[email] = password
  localStorage.setItem(SELLER_AUTH_KEY, JSON.stringify(db))
}
function verifySellerPassword(email, password) {
  const db = getStoredSellerPasswords()
  return db[email] === password
}
function sellerHasPassword(email) {
  const db = getStoredSellerPasswords()
  return !!db[email]
}

// ─── View states ──────────────────────────────────────────────────
const VIEW = { LIST: 'list', LOGIN: 'login', REGISTER: 'register', DASHBOARD: 'dashboard' }

export default function SellerDashboard({ onClose }) {
  const { success, error } = useToast()
  const [view, setView] = useState(VIEW.LIST)
  const [tab, setTab] = useState('products')
  const [sellers, setSellers] = useState([])
  const [activeSeller, setActiveSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ productName: '', productBrand: '', productDetails: '', productPrice: '', stock: '', productImageUrl: '' })

  // Login state
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Register state
  const [regForm, setRegForm] = useState({ name: '', eMail: '', password: '', confirmPassword: '' })
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    getAllSellers().then(r => setSellers(Array.isArray(r.data) ? r.data : [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!activeSeller) return
    setLoading(true)
    Promise.all([getAllProducts(), getAllOrders()])
      .then(([pRes, oRes]) => {
        const allP = Array.isArray(pRes.data) ? pRes.data : []
        setProducts(allP.filter(p => p.seller?.id === activeSeller.id))
        const allO = Array.isArray(oRes.data) ? oRes.data : []
        setOrders(allO.filter(o => o.seller?.id === activeSeller.id))
      }).catch(() => {}).finally(() => setLoading(false))
  }, [activeSeller])

  // ─── Select seller → go to login ────────────────────────────────
  const handleSelectSeller = (seller) => {
    setActiveSeller(seller)
    setLoginPassword('')
    setLoginError('')
    setView(VIEW.LOGIN)
  }

  // ─── Login ──────────────────────────────────────────────────────
  const handleLogin = () => {
    if (!loginPassword.trim()) { setLoginError('Please enter your password'); return }
    if (!sellerHasPassword(activeSeller.eMail)) {
      // First time — auto-set password
      saveSellerPassword(activeSeller.eMail, loginPassword)
      success('Password set! Welcome ' + activeSeller.name)
      setView(VIEW.DASHBOARD)
    } else if (verifySellerPassword(activeSeller.eMail, loginPassword)) {
      success('Welcome back, ' + activeSeller.name + '!')
      setView(VIEW.DASHBOARD)
    } else {
      setLoginError('Incorrect password. Please try again.')
    }
  }

  // ─── Register ───────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!regForm.name.trim() || !regForm.eMail.trim() || !regForm.password.trim()) {
      error('All fields are required'); return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.eMail)) {
      error('Enter a valid email address'); return
    }
    if (regForm.password.length < 6) {
      error('Password must be at least 6 characters'); return
    }
    if (regForm.password !== regForm.confirmPassword) {
      error('Passwords do not match'); return
    }
    const exists = sellers.find(s => s.eMail?.toLowerCase() === regForm.eMail.toLowerCase())
    if (exists) { error('A seller with this email already exists'); return }

    setRegLoading(true)
    try {
      const res = await addSeller({ name: regForm.name, eMail: regForm.eMail, profilePictureUrl: '' })
      const newSeller = res.data
      saveSellerPassword(regForm.eMail, regForm.password)
      const updated = await getAllSellers()
      const all = Array.isArray(updated.data) ? updated.data : []
      setSellers(all)
      const created = all.find(s => s.eMail === regForm.eMail) || newSeller
      setActiveSeller(created)
      success('Account created! Welcome, ' + regForm.name + '!')
      setView(VIEW.DASHBOARD)
      setRegForm({ name: '', eMail: '', password: '', confirmPassword: '' })
    } catch {
      error('Registration failed. Please try again.')
    } finally {
      setRegLoading(false)
    }
  }

  const handleLogout = () => {
    setActiveSeller(null)
    setLoginPassword('')
    setLoginError('')
    setView(VIEW.LIST)
  }

  const handleAddProduct = async () => {
    if (!newProduct.productName || !newProduct.productPrice || !newProduct.stock) { error('Fill all required fields'); return }
    try {
      await addProduct({ ...newProduct, productPrice: Number(newProduct.productPrice), stock: Number(newProduct.stock) })
      success('Product added!')
      setShowAddProduct(false)
      setNewProduct({ productName: '', productBrand: '', productDetails: '', productPrice: '', stock: '', productImageUrl: '' })
      const r = await getAllProducts()
      const all = Array.isArray(r.data) ? r.data : []
      setProducts(all.filter(p => p.seller?.id === activeSeller.id))
    } catch { error('Failed to add product') }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try { await deleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)); success('Deleted') } catch { error('Failed') }
  }

  const handleUpdateStatus = async (orderNumber, status) => {
    try {
      await updateOrderStatus(orderNumber, status)
      setOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, orderStatus: status } : o))
      success('Status updated to ' + status)
    } catch { error('Failed to update status') }
  }

  const updNew = k => e => setNewProduct(p => ({ ...p, [k]: e.target.value }))

  // ═══════════════════════════════════════════════════════════════
  // VIEW: SELLER LIST (with scroll fix)
  // ═══════════════════════════════════════════════════════════════
  if (view === VIEW.LIST) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md animate-fade-up flex flex-col"
          style={{ maxHeight: '90vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
            <h2 className="font-syne font-extrabold text-xl text-neutral-900 dark:text-white">🏪 Seller Dashboard</h2>
            <button onClick={onClose} className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 text-sm">✕</button>
          </div>

          {/* Scrollable seller list */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Select your seller account:</p>
            {sellers.length === 0 ? (
              <p className="text-sm text-center text-neutral-400 py-6">No sellers found.</p>
            ) : sellers.map(s => (
              <button key={s.id} onClick={() => handleSelectSeller(s)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all text-left mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center font-syne font-bold text-brand-600 dark:text-brand-400 text-sm shrink-0">
                  {s.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">{s.name}</div>
                  <div className="text-xs text-neutral-400 truncate">{s.eMail}</div>
                </div>
                <span className="ml-auto text-brand-500 shrink-0">→</span>
              </button>
            ))}
          </div>

          {/* Footer — Register option */}
          <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
            <p className="text-xs text-neutral-400 text-center mb-3">Don't have a seller account?</p>
            <button onClick={() => setView(VIEW.REGISTER)}
              className="w-full py-2.5 rounded-xl border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white font-semibold text-sm transition-all">
              + Register as Seller
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW: LOGIN
  // ═══════════════════════════════════════════════════════════════
  if (view === VIEW.LOGIN) {
    const isFirstTime = !sellerHasPassword(activeSeller?.eMail || '')
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-up">

          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <button onClick={() => { setActiveSeller(null); setView(VIEW.LIST) }}
              className="text-xs text-neutral-400 hover:text-brand-500 flex items-center gap-1">← Back</button>
            <button onClick={onClose} className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 text-sm">✕</button>
          </div>

          <div className="px-6 py-6">
            {/* Seller avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center font-syne font-bold text-brand-600 dark:text-brand-400 text-2xl mb-3">
                {activeSeller?.name?.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-syne font-bold text-lg text-neutral-900 dark:text-white">{activeSeller?.name}</h3>
              <p className="text-xs text-neutral-400">{activeSeller?.eMail}</p>
            </div>

            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              {isFirstTime ? 'Create a password' : 'Enter your password'}
            </label>
            {isFirstTime && (
              <p className="text-xs text-amber-500 mb-2">First login — set a password to secure your account</p>
            )}
            <input
              type="password"
              value={loginPassword}
              onChange={e => { setLoginPassword(e.target.value); setLoginError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder={isFirstTime ? 'Create new password' : 'Your password'}
              className="w-full px-3 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-brand-500 transition-all mb-1"
            />
            {loginError && <p className="text-xs text-red-500 mb-2">{loginError}</p>}

            <button onClick={handleLogin}
              className="w-full mt-3 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm transition-all">
              {isFirstTime ? 'Set Password & Enter →' : 'Login →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW: REGISTER
  // ═══════════════════════════════════════════════════════════════
  if (view === VIEW.REGISTER) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md animate-fade-up">

          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="font-syne font-extrabold text-xl text-neutral-900 dark:text-white">Create Seller Account</h2>
              <p className="text-xs text-neutral-400">Join Nexova as a verified seller</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 text-sm">✕</button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <SF label="Store / Brand Name *" placeholder="e.g. Apple Store" value={regForm.name}
              onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} />
            <SF label="Business Email *" placeholder="seller@example.com" value={regForm.eMail} type="email"
              onChange={e => setRegForm(p => ({ ...p, eMail: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <SF label="Password *" placeholder="Min 6 chars" value={regForm.password} type="password"
                onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} />
              <SF label="Confirm Password *" placeholder="Repeat password" value={regForm.confirmPassword} type="password"
                onChange={e => setRegForm(p => ({ ...p, confirmPassword: e.target.value }))} />
            </div>

            <button onClick={handleRegister} disabled={regLoading}
              className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all">
              {regLoading ? 'Creating Account…' : 'Create Seller Account →'}
            </button>

            <p className="text-center text-xs text-neutral-400">
              Already have an account?{' '}
              <button onClick={() => setView(VIEW.LIST)} className="text-brand-500 hover:underline font-semibold">Sign In</button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW: DASHBOARD (authenticated)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-up max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center font-syne font-bold text-brand-600 dark:text-brand-400 text-sm">
              {activeSeller.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-syne font-extrabold text-lg text-neutral-900 dark:text-white leading-none">{activeSeller.name}</h2>
              <p className="text-xs text-neutral-400">{activeSeller.eMail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-red-500 hover:border-red-300 transition-all">
              Logout
            </button>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 text-sm">✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-neutral-50 dark:bg-neutral-900 p-1 mx-6 mt-4 rounded-xl shrink-0">
          {[['products','📦 Products'],['orders','🛒 Orders'],['stats','📊 Stats']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {tab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-neutral-500">{products.length} products</p>
                <button onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all">
                  {showAddProduct ? '✕ Cancel' : '+ Add Product'}
                </button>
              </div>
              {showAddProduct && (
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <SF label="Product Name *" placeholder="e.g. Razer Mouse" value={newProduct.productName} onChange={updNew('productName')} />
                    <SF label="Brand *" placeholder="e.g. Razer" value={newProduct.productBrand} onChange={updNew('productBrand')} />
                  </div>
                  <SF label="Details" placeholder="Short description" value={newProduct.productDetails} onChange={updNew('productDetails')} />
                  <div className="grid grid-cols-2 gap-3">
                    <SF label="Price ($) *" placeholder="199" value={newProduct.productPrice} onChange={updNew('productPrice')} type="number" />
                    <SF label="Stock *" placeholder="10" value={newProduct.stock} onChange={updNew('stock')} type="number" />
                  </div>
                  <SF label="Image URL (optional)" placeholder="https://..." value={newProduct.productImageUrl} onChange={updNew('productImageUrl')} />
                  <button onClick={handleAddProduct}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-xl text-sm font-semibold">
                    Add Product
                  </button>
                </div>
              )}
              {loading ? <Spinner /> : products.length === 0 ? (
                <div className="text-center py-10"><div className="text-4xl mb-2">📦</div><p className="text-sm text-neutral-400">No products yet.</p></div>
              ) : (
                <div className="space-y-2">
                  {products.map(p => (
                    <ProductRow key={p.id} product={p} onDelete={handleDeleteProduct}
                      onUpdate={async (id, d) => {
                        try { await updateProductDetails({ productId: id, productDetails: d }); success('Updated!') }
                        catch { error('Failed') }
                      }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <p className="text-sm text-neutral-500 mb-4">{orders.length} orders</p>
              {loading ? <Spinner /> : orders.length === 0 ? (
                <div className="text-center py-10"><div className="text-4xl mb-2">🛒</div><p className="text-sm text-neutral-400">No orders yet</p></div>
              ) : (
                <div className="space-y-3">
                  {orders.map(o => (
                    <div key={o.id} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-bold text-sm text-neutral-900 dark:text-white">#{o.orderNumber}</span>
                          <p className="text-xs text-neutral-400 mt-0.5">{o.productName}</p>
                          {o.deliveryPincode && <p className="text-xs text-neutral-400">📍 Pin: {o.deliveryPincode} | 📱 {o.customerMobile}</p>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                          o.orderStatus==='DELIVERED'?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                          o.orderStatus==='SHIPPED'?'bg-blue-100 text-blue-700':
                          o.orderStatus==='PROCESSING'?'bg-amber-100 text-amber-700':'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}>
                          {o.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-syne font-bold text-brand-500">${o.productPrice}</span>
                        <div className="flex gap-1">
                          {['PROCESSING','SHIPPED','DELIVERED'].map(s => (
                            <button key={s} onClick={() => handleUpdateStatus(o.orderNumber, s)}
                              disabled={o.orderStatus===s||o.orderStatus==='DELIVERED'}
                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all
                                ${o.orderStatus===s?'bg-brand-500 text-white':'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 hover:bg-brand-100 hover:text-brand-600 disabled:opacity-30'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'stats' && (
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon="📦" label="Total Products" value={products.length} />
              <StatCard icon="🛒" label="Total Orders" value={orders.length} />
              <StatCard icon="💰" label="Revenue" value={`$${orders.reduce((s,o)=>s+(o.productPrice||0),0).toFixed(0)}`} />
              <StatCard icon="✅" label="Delivered" value={orders.filter(o=>o.orderStatus==='DELIVERED').length} />
              <StatCard icon="🚚" label="Shipped" value={orders.filter(o=>o.orderStatus==='SHIPPED').length} />
              <StatCard icon="⚙" label="Processing" value={orders.filter(o=>o.orderStatus==='PROCESSING').length} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Reusable components ──────────────────────────────────────────
function ProductRow({ product, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [details, setDetails] = useState(product.productDetails || '')
  const [imgUrl, setImgUrl] = useState(`https://picsum.photos/seed/nexova${product.id}/60/60`)
  useEffect(() => { fetchProductImage(product, 'tiny').then(url => setImgUrl(url)) }, [product.id])
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl">
      <img src={imgUrl} alt={product.productName} className="w-12 h-12 rounded-lg object-cover shrink-0" onError={e => e.target.style.display='none'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{product.productName}</span>
          <span className="text-[10px] bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded font-semibold shrink-0">${product.productPrice}</span>
        </div>
        {editing ? (
          <div className="flex gap-1 mt-1">
            <input value={details} onChange={e => setDetails(e.target.value)}
              className="flex-1 text-xs px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none" />
            <button onClick={() => { onUpdate(product.id, details); setEditing(false) }}
              className="text-xs px-2 py-1 bg-brand-500 text-white rounded-lg">Save</button>
          </div>
        ) : <p className="text-xs text-neutral-400 truncate">{product.productDetails || '—'}</p>}
        <p className={`text-[10px] font-semibold mt-0.5 ${product.stock > 5 ? 'text-green-600' : 'text-amber-500'}`}>Stock: {product.stock}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={() => setEditing(!editing)}
          className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs hover:bg-brand-100 transition-colors">✏</button>
        <button onClick={() => onDelete(product.id)}
          className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs hover:bg-red-100 hover:text-red-500 transition-colors">✕</button>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-syne font-bold text-xl text-brand-500">{value}</div>
      <div className="text-xs text-neutral-400 mt-0.5">{label}</div>
    </div>
  )
}

function SF({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">{label}</label>
      <input {...props} className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-brand-500 transition-all" />
    </div>
  )
}

function Spinner() {
  return <div className="flex justify-center py-10"><span className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin-slow inline-block" /></div>
}
