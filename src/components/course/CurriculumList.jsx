import { Link } from 'react-router-dom'
import { Lock, PlayCircle } from 'lucide-react'
import Accordion from '../ui/Accordion.jsx'
import { formatDuration, totalMinutes } from '../../data/lessons.js'

export default function CurriculumList({ sections, slug }) {
  return (
    <div className="space-y-2.5">
      {sections.map((s, i) => (
        <Accordion key={s.id} title={s.title} defaultOpen={i === 0} meta={`${s.lessons.length} bài · ${totalMinutes(s.lessons)} phút`}>
          <ul>
            {s.lessons.map((l) => (
              <li key={l.id} className="flex items-center gap-3 border-b border-line px-4 py-2.5 text-[13px] last:border-b-0">
                <PlayCircle className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                <span className="flex-1">{l.title}</span>
                {l.preview ? (
                  <Link to={`/hoc/${slug}/${l.id}`} className="rounded bg-sky-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-sky-700">
                    Xem thử
                  </Link>
                ) : null}
                <span className="w-11 text-right text-xs text-muted">{formatDuration(l.durationSec)}</span>
                {l.preview ? <span className="w-4" /> : <Lock className="h-3.5 w-3.5 text-muted" aria-label="Đăng ký để xem" />}
              </li>
            ))}
          </ul>
        </Accordion>
      ))}
    </div>
  )
}
