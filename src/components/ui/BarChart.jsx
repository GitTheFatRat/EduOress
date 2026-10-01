import { vndShort } from '../../lib/format.js'

export default function BarChart({ data, format = vndShort, height = 200, label = 'Biểu đồ cột' }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-3" style={{ height }} role="img" aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}>
      {data.map((d) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[11px] text-muted">{d.value ? format(d.value) : ''}</span>
          <div className="w-full max-w-12 rounded-t bg-brand" style={{ height: `${(d.value / max) * 70}%`, minHeight: d.value ? 4 : 0 }} />
          <span className="text-xs text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
