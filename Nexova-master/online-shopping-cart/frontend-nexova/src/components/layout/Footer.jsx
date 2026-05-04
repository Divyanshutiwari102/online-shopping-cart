export default function Footer() {
  const cols = [
    { title: 'Products',  links: ['Electronics', 'Mobile', 'Computers', 'Gaming', 'Cameras'] },
    { title: 'Company',   links: ['About Us', 'Careers', 'Blog', 'Press'] },
    { title: 'Support',   links: ['Help Center', 'Contact', 'Returns', 'Track Order'] },
    { title: 'Legal',     links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy'] },
  ]

  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 sm:col-span-1">
            <div className="font-syne font-extrabold text-xl text-neutral-900 dark:text-white mb-3">
              Nexova<span className="text-brand-500">.</span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[200px]">
              Global marketplace. Source smarter, buy better — millions of products from verified sellers.
            </p>
            <a href="mailto:cscience487@gmail.com"
              className="inline-flex items-center gap-1.5 mt-4 text-xs text-brand-500 hover:text-brand-400 transition-colors font-medium">
              ✉ cscience487@gmail.com
            </a>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a
                      href={l === 'Contact' ? 'mailto:cscience487@gmail.com' : '#'}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-500 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-neutral-400 dark:text-neutral-600">© 2025 Nexova Inc. All rights reserved.</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            Built for global commerce 🌍 · <a href="mailto:cscience487@gmail.com" className="hover:text-brand-500 transition-colors">cscience487@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
