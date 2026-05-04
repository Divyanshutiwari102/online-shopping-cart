const CATEGORIES = [
  { label: 'All',         icon: '🔥' },
  { label: 'Electronics', icon: '💻' },
  { label: 'Mobile',      icon: '📱' },
  { label: 'Audio',       icon: '🎧' },
  { label: 'Gaming',      icon: '🎮' },
  { label: 'Cameras',     icon: '📷' },
  { label: 'Wearables',   icon: '⌚' },
  { label: 'Computers',   icon: '🖥️' },
  { label: 'Drones',      icon: '🚁' },
]

export default function CategoryBar({ active = 'All', onChange = () => {} }) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
        <div className="flex items-center gap-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(c => (
            <button
              key={c.label}
              onClick={() => onChange(c.label)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${active === c.label
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              <span className="text-base leading-none">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}