export default function DemoBanner({ wakingUp }) {
  if (wakingUp) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
        <span className="w-4 h-4 border-2 border-blue-400/40 border-t-blue-500 rounded-full animate-spin shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-semibold">Backend waking up</span> — Render free tier cold start ho raha hai (~30 sec). Real products load honge automatically...
        </p>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
      <span className="text-xl">⚠️</span>
      <p className="text-sm text-amber-800 dark:text-amber-300">
        <span className="font-semibold">Demo mode</span> — Backend not reachable. Showing sample products.
      </p>
    </div>
  )
}
