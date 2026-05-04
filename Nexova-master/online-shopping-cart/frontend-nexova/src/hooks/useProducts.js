import { useState, useEffect, useCallback } from 'react'
import { getAllProducts } from '../services/api'

const DEMO_PRODUCTS = [
  { id: 1,  productName: 'Razer DeathAdder V3',     productBrand: 'Razer',    productDetails: 'Ergonomic gaming mouse, 30K DPI optical sensor',        productPrice: 199,  stock: 15, favoriteNumber: 0, category: { categoryName: 'Gaming' } },
  { id: 2,  productName: 'MacBook Air M3 13"',       productBrand: 'Apple',    productDetails: '8-core GPU, 8GB RAM, 256GB SSD, Liquid Retina display',  productPrice: 1099, stock: 8,  favoriteNumber: 0, category: { categoryName: 'Computers' } },
  { id: 3,  productName: 'Galaxy S25 Ultra',         productBrand: 'Samsung',  productDetails: '6.9" QHD+, 200MP Camera, S-Pen included, 5000mAh',      productPrice: 1299, stock: 3,  favoriteNumber: 0, category: { categoryName: 'Mobile' } },
  { id: 4,  productName: 'Sony WH-1000XM6',          productBrand: 'Sony',     productDetails: 'Industry-leading ANC, 30hr battery, multipoint connect', productPrice: 349,  stock: 22, favoriteNumber: 0, category: { categoryName: 'Audio' } },
  { id: 5,  productName: 'iPad Pro 13" M4',          productBrand: 'Apple',    productDetails: 'Ultra Retina XDR, Apple Pencil Pro support, 5G ready',   productPrice: 1299, stock: 6,  favoriteNumber: 0, category: { categoryName: 'Electronics' } },
  { id: 6,  productName: 'Apple Watch Ultra 2',      productBrand: 'Apple',    productDetails: 'Titanium case, 60hr battery, precision GPS, depth 100m', productPrice: 799,  stock: 11, favoriteNumber: 0, category: { categoryName: 'Wearables' } },
  { id: 7,  productName: 'Logitech MX Keys S',       productBrand: 'Logitech', productDetails: 'Smart illuminated keys, 10-device multi-pairing, USB-C', productPrice: 119,  stock: 28, favoriteNumber: 0, category: { categoryName: 'Electronics' } },
  { id: 8,  productName: 'Canon EOS R6 Mark III',    productBrand: 'Canon',    productDetails: '40fps burst, 4K 60p video, dual card slots, IBIS',       productPrice: 2499, stock: 2,  favoriteNumber: 0, category: { categoryName: 'Cameras' } },
  { id: 9,  productName: 'JBL Flip 7',               productBrand: 'JBL',      productDetails: 'IP68 waterproof, 14hr playtime, PartyBoost compatible',  productPrice: 129,  stock: 40, favoriteNumber: 0, category: { categoryName: 'Audio' } },
  { id: 10, productName: 'Dell XPS 15 OLED',         productBrand: 'Dell',     productDetails: '3.5K OLED touch, i9-14900H, RTX 4070, 64GB DDR5',       productPrice: 2799, stock: 5,  favoriteNumber: 0, category: { categoryName: 'Computers' } },
]

// Category tab name → backend category_name exact match
const CATEGORY_MAP = {
  'Electronics': ['Electronics'],
  'Mobile':      ['Mobile'],
  'Audio':       ['Audio'],
  'Gaming':      ['Gaming'],
  'Cameras':     ['Cameras'],
  'Wearables':   ['Wearables'],
  'Computers':   ['Computers'],
  'Drones':      ['Drones'],
}

export function useProducts() {
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [isDemo, setIsDemo]             = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getAllProducts()
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data)
        setIsDemo(false)
      } else {
        setProducts(DEMO_PRODUCTS)
        setIsDemo(true)
      }
    } catch {
      setProducts(DEMO_PRODUCTS)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const filteredProducts = products.filter(p => {
    // Search filter
    const q = searchQuery.toLowerCase()
    const matchSearch = !q ||
      p.productName?.toLowerCase().includes(q) ||
      p.productBrand?.toLowerCase().includes(q) ||
      p.productDetails?.toLowerCase().includes(q)

    // Category filter — backend se category object aata hai: p.category.categoryName
    const matchCategory = activeCategory === 'All' || (() => {
      const categoryNames = CATEGORY_MAP[activeCategory] || [activeCategory]

      // Method 1: Backend category object (p.category.categoryName)
      if (p.category?.categoryName) {
        return categoryNames.some(c =>
          p.category.categoryName.toLowerCase() === c.toLowerCase()
        )
      }

      // Method 2: Fallback — product fields mein keyword search
      const text = `${p.productName} ${p.productBrand} ${p.productDetails}`.toLowerCase()
      return categoryNames.some(c => text.includes(c.toLowerCase()))
    })()

    return matchSearch && matchCategory
  })

  return {
    products,
    filteredProducts,
    loading,
    isDemo,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    refetch: fetchProducts,
  }
}
