import { statusMeta } from '../../lib/status.js'

const tones = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-sky-50 text-sky-700',
  gray: 'bg-surface text-muted',
  brand: 'bg-brand-soft text-brand',
}

export default function Badge({ tone = 'gray', children }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function StatusBadge({ status }) {
  const m = statusMeta[status] ?? { label: status, tone: 'gray' }
  return <Badge tone={m.tone}>{m.label}</Badge>
}
