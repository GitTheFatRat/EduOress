export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-white px-6 py-14 text-center">
      {Icon && <Icon className="mx-auto h-9 w-9 text-muted/60" strokeWidth={1.25} aria-hidden />}
      <p className="mt-3 font-semibold">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
