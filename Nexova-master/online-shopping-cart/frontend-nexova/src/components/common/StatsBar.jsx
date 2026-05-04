const STATS = [
  { icon: '📦', value: null,    label: 'Products Listed',    key: 'products' },
  { icon: '🏪', value: '10K+',  label: 'Verified Sellers'  },
  { icon: '🌍', value: '190+',  label: 'Countries Served'  },
  { icon: '⭐', value: '4.9',   label: 'Avg. Rating'       },
]

export default function StatsBar({ productCount }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
      {STATS.map(s => (
        <div
          key={s.label}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-center hover:border-brand-400 transition-colors"
        >
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="font-syne font-extrabold text-2xl text-brand-500 leading-none mb-1">
            {s.key === 'products' ? (productCount || '—') : s.value}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
