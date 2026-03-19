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