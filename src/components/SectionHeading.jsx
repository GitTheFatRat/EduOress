import { Link } from 'react-router-dom'

export default function SectionHeading({ title, sub, to, action }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {sub && <p className="mt-1 text-[13px] text-muted">{sub}</p>}
      </div>
      {to && (
        <Link to={to} className="shrink-0 rounded-full border border-ink px-4 py-1.5 text-[13px] font-medium transition hover:border-brand hover:text-brand">
          {action}
        </Link>
      )}
    </div>
  )
}
