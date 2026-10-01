import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  const btn = 'grid h-8 w-8 place-items-center rounded-full text-[13px] transition'
  return (
    <nav aria-label="Phân trang" className="mt-10 flex items-center justify-center gap-2">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Trang trước" className={`${btn} hover:bg-surface disabled:opacity-30`}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`${btn} ${n === page ? 'bg-ink text-white' : 'hover:bg-surface'}`}
        >
          {n}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Trang sau" className={`${btn} hover:bg-surface disabled:opacity-30`}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
