export default function Tabs({ tabs, value, onChange, label }) {
  const onKey = (e, idx) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    onChange(tabs[next].id)
    document.getElementById(`tab-${tabs[next].id}`)?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className="flex overflow-x-auto rounded-t-card border border-b-0 border-line bg-white">
      {tabs.map((t, i) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`flex-1 whitespace-nowrap border-r border-line px-4 py-3 text-sm font-medium transition-colors last:border-r-0 ${
              active ? 'bg-surface text-brand' : 'hover:text-brand'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
