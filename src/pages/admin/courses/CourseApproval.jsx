import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import ReasonModal from '../../../components/ui/ReasonModal.jsx'
import { btnOutline, btnPrimary, btnSm, card } from '../../../components/ui/styles.js'
import { useCourses, useLessons, useNotifications } from '../../../hooks/useData.js'
import { levelLabels } from '../../../data/courses.js'
import { vnd } from '../../../lib/format.js'

export default function CourseApproval() {
  const { courses, update } = useCourses()
  const lessons = useLessons()
  const { notify } = useNotifications()
  const [rejecting, setRejecting] = useState(null)
  const pending = courses.filter((c) => c.status === 'PENDING_REVIEW')

  const approve = (c) => {
    update(c.id, { status: 'PUBLISHED', publishedAt: new Date().toISOString(), rejectReason: '' })
    lessons.items.filter((l) => l.courseId === c.id && l.moderation === 'PENDING').forEach((l) => lessons.update(l.id, { moderation: 'APPROVED' }))
    if (c.ownerId) notify(c.ownerId, 'Khóa học đã được duyệt', `"${c.title}" đã được đăng công khai.`, 'COURSE')
  }
  const reject = (reason) => {
    update(rejecting.id, { status: 'REJECTED', rejectReason: reason })
    if (rejecting.ownerId) notify(rejecting.ownerId, 'Khóa học chưa được duyệt', `"${rejecting.title}": ${reason}`, 'COURSE')
  }

  return (
    <>
      <PageHeader title="Duyệt khóa học" subtitle="Kiểm tra nội dung trước khi khóa học hiển thị công khai." />
      {pending.length === 0 ? (
        <EmptyState icon={BadgeCheck} title="Không có khóa học nào chờ duyệt" />
      ) : (
        <div className="space-y-4">
          {pending.map((c) => (
            <article key={c.id} className={`${card} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-semibold">{c.title}</h2>
                  <p className="mt-1 text-xs text-muted">{c.provider} · {c.category} · {levelLabels[c.level]} · {c.weeks} tuần · {c.price ? vnd(c.price) : 'Miễn phí'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/courses/${c.id}/content`} className={btnSm}>Xem bài giảng ({lessons.items.filter((l) => l.courseId === c.id).length})</Link>
                  <button className={btnOutline} onClick={() => setRejecting(c)}>Từ chối</button>
                  <button className={btnPrimary} onClick={() => approve(c)}>Duyệt</button>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-ink/80">{c.description[0]}</p>
              {c.objectives.length > 0 && <ul className="mt-2 list-disc pl-5 text-[13px] text-muted">{c.objectives.map((o) => <li key={o}>{o}</li>)}</ul>}
            </article>
          ))}
        </div>
      )}
      <ReasonModal open={Boolean(rejecting)} title={`Từ chối "${rejecting?.title}"`} onClose={() => setRejecting(null)} onSubmit={reject} />
    </>
  )
}
