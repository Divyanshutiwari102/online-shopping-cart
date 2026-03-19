import ProductCard from './ProductCard'

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      <div className="aspect-square bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 animate-shimmer bg-[length:200%_100%]" />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-shimmer bg-[length:200%_100%]" />
        <div className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-shimmer bg-[length:200%_100%]" />
        <div className="h-3 w-3/5 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-shimmer bg-[length:200%_100%]" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-shimmer bg-[length:200%_100%]" />
          <div className="h-9 w-9 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-shimmer bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid({ products, loading, onProductClick, onAuthRequired }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-syne font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-2">No products found</h3>
        <p className="text-sm text-neutral-400">Try a different search term or category</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product, i) => (
        <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
          <ProductCard product={product} onClick={() => onProductClick(product)} onAuthRequired={onAuthRequired} />
        </div>
      ))}
    </div>
  )
}