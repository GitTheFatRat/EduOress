import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <div className="bg-surface">
      <nav aria-label="Đường dẫn" className="mx-auto flex max-w-[1140px] flex-wrap items-center gap-1.5 px-4 py-2.5 text-xs text-muted">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
            {it.to ? (
              <Link to={it.to} className="hover:text-brand">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-ink/70">{it.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
