export default function DemoBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
      <span className="text-xl">⚠️</span>
      <p className="text-sm text-amber-800 dark:text-amber-300">
        <span className="font-semibold">Demo mode</span> — Backend not reachable at{' '}
        <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs font-mono">localhost:8080</code>.
        Showing sample products. Start your Spring Boot backend to see real data.
      </p>
    </div>
  )
}
