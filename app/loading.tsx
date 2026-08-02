export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0a1220]/82 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-8 py-7 text-white shadow-2xl">
        <div className="relative h-16 w-16">
          <div className="hei-loader-pulse absolute inset-0 rounded-full border-2 border-amber-300/40" />
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div className="hei-loader-spin absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 border-r-amber-300" />
        </div>
        <p className="hei-loader-shimmer text-sm font-semibold uppercase tracking-[0.22em]">
          Đang tải...
        </p>
        <div className="flex items-center gap-1">
          <span className="hei-loader-dot h-1.5 w-1.5 rounded-full bg-amber-300 [animation-delay:0ms]" />
          <span className="hei-loader-dot h-1.5 w-1.5 rounded-full bg-amber-300 [animation-delay:120ms]" />
          <span className="hei-loader-dot h-1.5 w-1.5 rounded-full bg-amber-300 [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
