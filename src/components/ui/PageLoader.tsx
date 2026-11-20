export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500/25 border-t-violet-500 animate-spin" />
        <p className="text-xs font-bold text-white/30">جارٍ التحميل...</p>
      </div>
    </div>
  )
}
