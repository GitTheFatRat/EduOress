import { useState } from 'react'
import Rating from '../ui/Rating.jsx'
import Pagination from '../ui/Pagination.jsx'
import { summarize } from '../../data/reviews.js'

const PER_PAGE = 3
const initials = (name) => name.trim().split(/\s+/).slice(-1)[0][0]

export default function ReviewList({ reviews }) {
  const [page, setPage] = useState(1)
  const { avg, total, pct } = summarize(reviews)
  const pages = Math.ceil(total / PER_PAGE)
  const shown = reviews.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <h3 className="text-sm font-bold">Đánh giá của học viên</h3>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <p className="font-display text-5xl font-bold leading-none">{avg.toFixed(1)}</p>
          <Rating value={avg} className="mt-2" />
          <p className="mt-1 text-xs text-muted">dựa trên {total} đánh giá</p>
        </div>
        <ul className="flex-1 space-y-1.5" aria-label="Phân bố số sao">
          {[5, 4, 3, 2, 1].map((n) => (
            <li key={n} className="flex items-center gap-3 text-xs">
              <span className="w-10 shrink-0 text-muted">{n} sao</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                <span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct[n]}%` }} />
              </span>
              <span className="w-9 text-right text-muted">{pct[n]}%</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-8 divide-y divide-line">
        {shown.map((r) => (
          <li key={r.id} className="flex gap-3 py-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft font-display font-bold text-brand" aria-hidden>
              {initials(r.name)}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold">{r.name}</p>
                <time className="text-xs text-muted">{r.date}</time>
              </div>
              <Rating value={r.rating} size="h-3 w-3" className="mt-0.5" />
              <p className="mt-1.5 text-[13px] leading-6 text-ink/75">{r.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>
  )
}
