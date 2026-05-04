export default function Hero({ onShopNow }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-10">

      {/* Main hero — 3 cols */}
      <div className="lg:col-span-3 relative overflow-hidden rounded-2xl bg-neutral-950 min-h-[280px] flex flex-col justify-end p-8 sm:p-10">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            ✦ New Season Deals
          </span>
          <h1 className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.08] tracking-tight mb-3">
            Source Smarter.<br />
            <span className="text-brand-500">Buy Better.</span>
          </h1>
          <p className="text-sm text-white/50 mb-6 max-w-sm leading-relaxed">
            Millions of products from verified sellers worldwide. From electronics to industrial goods.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onShopNow}
              className="bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all active:scale-95 hover:shadow-lg hover:shadow-brand-500/30"
            >
              Shop Now →
            </button>
            <button className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-6 py-3 rounded-xl text-sm transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Side cards — 2 cols */}
      <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
        <SideCard
          bg="from-[#0d3349] to-[#0f5c7a]"
          tag="Limited Deals"
          title="Electronics & Gadgets"
          icon="⚡"
        />
        <SideCard
          bg="from-[#1a0f00] to-[#5c2d00]"
          tag="New Arrivals"
          title="Industrial Products"
          icon="🏭"
        />
      </div>