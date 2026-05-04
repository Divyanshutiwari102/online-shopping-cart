import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ userName: '', email: '', password: '' })
  const { login, register, loading, error, setError } = useAuth()
  const { success } = useToast()

  const upd = (k) => (e) => {
    setError(null)
    setForm(f => ({ ...f, [k]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (tab === 'login') {
      const result = await login({ userName: form.userName, password: form.password })
      if (result.success) {
        success('Welcome back!')
        onClose()
      }
    } else {
      const result = await register({ userName: form.userName, email: form.email, password: form.password })
      if (result.success) {
        success('Account created! Please sign in.')
        setTab('login')
        setForm(f => ({ ...f, password: '' }))
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-syne font-extrabold text-2xl text-neutral-900 dark:text-white">
            {tab === 'login' ? 'Welcome back' : 'Join Nexova'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-6">
          {tab === 'login' ? 'Sign in to your account to continue' : 'Create your free account today'}
        </p>

        {/* Tabs */}
        <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl mb-6">
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize
                ${tab === t
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Username" type="text" placeholder="Enter username" value={form.userName} onChange={upd('userName')} required />
          {tab === 'register' && (
            <Field label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={upd('email')} required />
          )}
          <Field label="Password" type="password" placeholder="••••••••" value={form.password} onChange={upd('password')} required />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
              {typeof error === 'string' ? error : 'Something went wrong. Try again.'}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" /> Loading...</>
              : tab === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-4">
          By continuing, you agree to Nexova's{' '}
          <span className="text-brand-500 cursor-pointer hover:underline">Terms of Service</span>
        </p>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
      />
    </div>
  )
}
