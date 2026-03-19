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