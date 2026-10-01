import { ChevronDown } from 'lucide-react'

export default function Accordion({ title, meta, defaultOpen = false, children, className = '' }) {
  return (
    <details open={defaultOpen} className={`group rounded-lg bg-white ${className}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-semibold [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
          {title}
        </span>
        {meta && <span className="shrink-0 text-xs font-normal text-muted">{meta}</span>}
      </summary>
      <div className="border-t border-line">{children}</div>
    </details>
  )
}
