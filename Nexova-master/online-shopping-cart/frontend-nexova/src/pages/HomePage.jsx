import { useState } from 'react'
import Hero from '../components/common/Hero'
import StatsBar from '../components/common/StatsBar'
import DemoBanner from '../components/common/DemoBanner'
import CategoryBar from '../components/layout/CategoryBar'
import ProductGrid from '../components/product/ProductGrid'
import ProductModal from '../components/product/ProductModal'
import { useProducts } from '../hooks/useProducts'

export default function HomePage({ searchQuery, setSearchQuery, onAuthRequired }) {
  const {
    filteredProducts, products, loading, isDemo, activeCategory, setActiveCategory,
  } = useProducts()

  const [selectedProduct, setSelectedProduct] = useState(null)

  const displayed = searchQuery
    ? products.filter(p => {
        const q = searchQuery.toLowerCase()
        return p.productName?.toLowerCase().includes(q) || p.productBrand?.toLowerCase().includes(q) || p.productDetails?.toLowerCase().includes(q)
      })
    : filteredProducts

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {!searchQuery && <Hero onShopNow={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} />}
      {!searchQuery && <StatsBar productCount={products.length} />}
      {isDemo && <DemoBanner />}
      {!searchQuery && <CategoryBar active={activeCategory} onChange={setActiveCategory} />}

      <div id="products-section" className="flex items-center justify-between mt-8 mb-5">
        <div>
          <h2 className="font-syne font-bold text-2xl text-neutral-900 dark:text-white">
            {searchQuery
              ? <>Results for <span className="text-brand-500">"{searchQuery}"</span></>
              : activeCategory !== 'All'
                ? <><span className="text-brand-500">{activeCategory}</span> Products</>
                : <>Featured <span className="text-brand-500">Products</span></>
            }
          </h2>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5">{displayed.length} product{displayed.length !== 1 ? 's' : ''} found</p>
        </div>
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-brand-500 hover:text-brand-500 transition-all">
            ✕ Clear
          </button>
        )}
      </div>

      <ProductGrid
        products={displayed}
        loading={loading}
        onProductClick={setSelectedProduct}
        onAuthRequired={onAuthRequired}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAuthRequired={onAuthRequired}
        />
      )}
    </main>
  )
}
