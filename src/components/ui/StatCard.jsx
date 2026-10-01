export default function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-muted">{label}</p>
        {Icon && <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand"><Icon className="h-4 w-4" aria-hidden /></span>}
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}
