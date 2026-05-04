import { useState, useEffect, useCallback } from 'react'
import { getAllProducts } from '../services/api'

const SAMPLE_PRODUCTS = [
  {
    id: 1, productName: 'Sony WH-1000XM5', productBrand: 'Sony',
    productDetails: 'Industry-leading noise canceling headphones with 30-hour battery life.',
    productPrice: 349.99, stock: 15, category: 'Audio',
    productImageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
  },
  {
    id: 2, productName: 'iPhone 15 Pro', productBrand: 'Apple',
    productDetails: 'A17 Pro chip, titanium design, and a 48MP main camera.',
    productPrice: 999.99, stock: 8, category: 'Mobile',
    productImageUrl: 'https://images.unsplash.com/photo-1697299059530-79a247fae4f0?w=400',
  },
  {
    id: 3, productName: 'Samsung 4K OLED TV', productBrand: 'Samsung',
    productDetails: '65" OLED display with quantum HDR and smart TV features.',
    productPrice: 1499.99, stock: 5, category: 'Electronics',
    productImageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400',
  },
  {
    id: 4, productName: 'PlayStation 5', productBrand: 'Sony',
    productDetails: 'Next-gen gaming console with ultra-high speed SSD and 4K gaming.',
    productPrice: 499.99, stock: 3, category: 'Gaming',
    productImageUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400',
  },
  {
    id: 5, productName: 'MacBook Pro 14"', productBrand: 'Apple',
    productDetails: 'M3 Pro chip, Liquid Retina XDR display, 18-hour battery.',
    productPrice: 1999.99, stock: 10, category: 'Computers',
    productImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
  },
  {
    id: 6, productName: 'Canon EOS R6 Mark II', productBrand: 'Canon',
    productDetails: '24.2MP full-frame mirrorless camera with 40fps burst shooting.',
    productPrice: 2499.99, stock: 6, category: 'Cameras',
    productImageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
  },
  {
    id: 7, productName: 'Apple Watch Ultra 2', productBrand: 'Apple',
    productDetails: 'Most rugged Apple Watch with precision GPS and 36-hour battery.',
    productPrice: 799.99, stock: 12, category: 'Wearables',
    productImageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
  },
  {
    id: 8, productName: 'DJI Mini 4 Pro', productBrand: 'DJI',
    productDetails: '4K/60fps drone under 249g with omnidirectional obstacle sensing.',
    productPrice: 759.99, stock: 9, category: 'Drones',
    productImageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
  },
]

const RETRY_INTERVAL = 10000
const MAX_WAKE_TIME = 60000

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [wakingUp, setWakingUp] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  const fetchProducts = useCallback(async (isRetry = false) => {
    try {
      const res = await getAllProducts()
      const data = res.data
      setProducts(Array.isArray(data) ? data : [])
      setIsDemo(false)
      setWakingUp(false)
      setLoading(false)
    } catch (err) {
      if (!isRetry) {
        setProducts(SAMPLE_PRODUCTS)
        setIsDemo(true)
        setLoading(false)
        setWakingUp(true)
        setTimeout(() => setWakingUp(false), MAX_WAKE_TIME)
        setTimeout(() => fetchProducts(true), RETRY_INTERVAL)
      } else {
        setTimeout(() => fetchProducts(true), RETRY_INTERVAL)
      }
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  return {
    products,
    filteredProducts,
    loading,
    isDemo,
    wakingUp,
    activeCategory,
    setActiveCategory,
  }
}

export default useProducts
