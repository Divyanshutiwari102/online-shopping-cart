import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'

const STEPS = ['Delivery', 'Contact', 'Payment', 'Confirm']

export default function CheckoutModal({ onClose, onSuccess }) {
  const { cart, cartTotal, checkout } = useCart()
  const { success, error } = useToast()
  const { user } = useAuth()

  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const [deliveryType, setDeliveryType] = useState('home')
  const [address, setAddress] = useState({ city: '', district: '', street: '', apartmentNumber: '', country: 'India' })
  const [contact, setContact] = useState({ customerEmail: '', customerMobile: '', deliveryPincode: '' })
  const [payment, setPayment] = useState({ nameAndSurname: '', cardNumber: '4766 1902 7659 7812', expirationDate: '02/26', cvv: '', promoCode: '' })

  const updAddr = k => e => setAddress(p => ({ ...p, [k]: e.target.value }))
  const updCont = k => e => setContact(p => ({ ...p, [k]: e.target.value }))
  const updPay  = k => e => setPayment(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    if (step === 0 && deliveryType === 'home' && (!address.city || !address.street)) {
      error('Please fill city and street'); return false
    }
    if (step === 1) {
      if (!contact.customerEmail) { error('Email is required for order tracking'); return false }
      if (!contact.customerMobile || contact.customerMobile.length < 10) { error('Valid mobile number required'); return false }
      if (!contact.deliveryPincode || contact.deliveryPincode.length < 6) { error('Valid 6-digit pincode required'); return false }
    }
    if (step === 2 && (!payment.nameAndSurname || !payment.cvv)) { error('Fill all payment fields'); return false }
    return true
  }

  const handleNext = () => { if (validate()) setStep(s => s + 1) }

  const handlePay = async () => {
    setLoading(true)
    const deliveryAddr = deliveryType === 'home'
      ? `${address.street}, ${address.district}, ${address.city}, ${address.country} - ${contact.deliveryPincode}`
      : 'Store Pickup - Nexova Store, Connaught Place, New Delhi'

    const result = await checkout({
      ...payment,
      cvv: Number(payment.cvv),
      deliveryType,
      ...contact,
      deliveryAddress: deliveryAddr,
    })
    if (result.success) {
      setOrder(result.order)
      setDone(true)
      success('Order placed! Check your email for confirmation. 🎉')
      onSuccess?.()
    } else {
      error(result.error || 'Payment failed. Check card details.')
    }
    setLoading(false)
  }

  const estDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-up overflow-hidden max-h-[95vh] overflow-y-auto">

        {done ? (
          <div className="px-8 py-10 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <h2 className="font-syne font-extrabold text-2xl text-neutral-900 dark:text-white mb-2">Order Placed!</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Confirmation email sent to <span className="font-semibold text-neutral-800 dark:text-white">{contact.customerEmail}</span>
            </p>
            {order && (
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 mb-4 text-left space-y-2.5 text-sm">
                {order.orderNumber && <SRow label="Order #"    value={`#${order.orderNumber}`} />}
                {order.totalAmount  && <SRow label="Total"     value={`$${order.totalAmount}`} orange />}
                <SRow label="Delivery"   value={deliveryType === 'home' ? `🏠 Home — ${address.city} - ${contact.deliveryPincode}` : '🏪 Store Pickup'} />
                <SRow label="Est. Delivery" value={`📅 ${estDate}`} />
                <SRow label="Mobile"     value={contact.customerMobile} />
                {order.paymentStatus && <SRow label="Payment"  value={order.paymentStatus} green />}
              </div>
            )}
            <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 mb-6 text-xs text-neutral-600 dark:text-neutral-300 text-left">
              📦 Status updates every 2 days automatically. Track via <span className="font-bold text-neutral-800 dark:text-white">Navbar → Orders → #{order?.orderNumber}</span>
            </div>
            <button onClick={onClose} className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Header + Stepper */}
            <div className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-syne font-extrabold text-xl text-neutral-900 dark:text-white">Checkout</h2>
                <button onClick={onClose} className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 text-sm">✕</button>
              </div>
              <div className="flex items-center">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex items-center gap-1.5 ${i <= step ? 'text-brand-500' : 'text-neutral-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                        ${i < step ? 'bg-brand-500 border-brand-500 text-white' : i === step ? 'border-brand-500 text-brand-500' : 'border-neutral-300 dark:border-neutral-600 text-neutral-400'}`}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className="text-[11px] font-medium hidden sm:block">{s}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1.5 ${i < step ? 'bg-brand-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 0: Delivery type + address */}
            {step === 0 && (
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Choose delivery method</p>
                <div className="grid grid-cols-2 gap-3">
                  <DelOpt icon="🏠" title="Home Delivery" sub="Delivered to your door" selected={deliveryType === 'home'} onClick={() => setDeliveryType('home')} />
                  <DelOpt icon="🏪" title="Store Pickup" sub="Free, collect in-store" selected={deliveryType === 'pickup'} onClick={() => setDeliveryType('pickup')} />
                </div>
                {deliveryType === 'home' && (
                  <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Delivery Address</p>
                    <div className="grid grid-cols-2 gap-3">
                      <CField label="City *"    placeholder="e.g. Delhi"     value={address.city}     onChange={updAddr('city')} />
                      <CField label="District"  placeholder="e.g. Connaught" value={address.district} onChange={updAddr('district')} />
                    </div>
                    <CField label="Street / Area *" placeholder="Street name, locality" value={address.street} onChange={updAddr('street')} />
                    <div className="grid grid-cols-2 gap-3">
                      <CField label="Apt / House No." placeholder="Flat/House No." value={address.apartmentNumber} onChange={updAddr('apartmentNumber')} />
                      <CField label="Country" placeholder="India" value={address.country} onChange={updAddr('country')} />
                    </div>
                  </div>
                )}
                {deliveryType === 'pickup' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-1">📍 Pickup Location</p>
                    <p>Nexova Store, Connaught Place, New Delhi — 110001</p>
                    <p className="text-xs mt-1 text-blue-500">Mon–Sat: 10AM – 7PM</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Contact — pincode + mobile + email */}
            {step === 1 && (
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Contact & Delivery Info</p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
                  📧 Order confirmation + tracking updates will be sent to your email every 2 days
                </div>
                <CField label="Email for Order Updates *" type="email" placeholder="your@email.com" value={contact.customerEmail} onChange={updCont('customerEmail')} />
                <CField label="Mobile Number *" type="tel" placeholder="10-digit mobile number" value={contact.customerMobile} onChange={updCont('customerMobile')} maxLength={10} />
                <CField label="Delivery Pincode *" type="text" placeholder="6-digit pincode" value={contact.deliveryPincode} onChange={updCont('deliveryPincode')} maxLength={6} />
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-3 text-xs text-neutral-400">
                  📅 Estimated Delivery: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{estDate}</span> (7 days from today)
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="px-6 py-5 space-y-3">
                <div className="max-h-24 overflow-y-auto border border-neutral-100 dark:border-neutral-800 rounded-xl p-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-0.5">
                      <span className="text-neutral-500 truncate max-w-[200px]">{item.productName}</span>
                      <span className="font-semibold text-neutral-900 dark:text-white ml-4">${item.productPrice?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <CField label="Cardholder Name *"   placeholder="Full name"              value={payment.nameAndSurname}   onChange={updPay('nameAndSurname')} />
                <CField label="Card Number *"        placeholder="0000 0000 0000 0000"   value={payment.cardNumber}        onChange={updPay('cardNumber')} />
                <div className="grid grid-cols-2 gap-3">
                  <CField label="Expiry *"  placeholder="MM/YY" value={payment.expirationDate} onChange={updPay('expirationDate')} />
                  <CField label="CVV *"     placeholder="123"   value={payment.cvv}            onChange={updPay('cvv')} maxLength={4} />
                </div>
                <CField label="Promo Code (optional)" placeholder="SAVE20" value={payment.promoCode} onChange={updPay('promoCode')} />
                <p className="text-xs text-center text-neutral-400">🔒 Encrypted & secure payment</p>
              </div>
            )}

            {/* Step 3: Confirm summary */}
            {step === 3 && (
              <div className="px-6 py-5 space-y-3">
                <SRow label="Delivery"     value={deliveryType === 'home' ? `🏠 ${address.street}, ${address.city}` : '🏪 Store Pickup'} />
                <SRow label="Pincode"      value={contact.deliveryPincode} />
                <SRow label="Mobile"       value={contact.customerMobile} />
                <SRow label="Email"        value={contact.customerEmail} />
                <SRow label="Est. Delivery" value={`📅 ${estDate}`} />
                <SRow label="Items"        value={`${cart.length} item${cart.length !== 1 ? 's' : ''}`} />
                <SRow label="Total"        value={`$${cartTotal.toFixed(2)}`} orange />
                <SRow label="Card"         value={`•••• ${payment.cardNumber.slice(-4)}`} />
                {payment.promoCode && <SRow label="Promo" value={payment.promoCode} />}
                <p className="text-xs text-center text-neutral-400 pt-2">By placing this order you agree to our Terms of Service</p>
              </div>
            )}

            {/* Footer buttons */}
            <div className="px-6 pb-6 flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all">
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button onClick={handleNext} className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95">
                  Continue →
                </button>
              ) : (
                <button onClick={handlePay} disabled={loading} className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" /> Processing...</> : `Pay $${cartTotal.toFixed(2)}`}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function DelOpt({ icon, title, sub, selected, onClick }) {
  return (
    <button onClick={onClick} className={`p-4 rounded-xl border-2 text-left transition-all w-full ${selected ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-brand-300'}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-sm font-semibold ${selected ? 'text-brand-600 dark:text-brand-400' : 'text-neutral-800 dark:text-neutral-200'}`}>{title}</div>
      <div className="text-xs text-neutral-400 mt-0.5">{sub}</div>
    </button>
  )
}

function CField({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input {...props} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" />
    </div>
  )
}

function SRow({ label, value, orange, green }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className={`text-sm font-semibold ${orange ? 'text-brand-500' : green ? 'text-green-600' : 'text-neutral-800 dark:text-neutral-200'}`}>{value}</span>
    </div>
  )
}
