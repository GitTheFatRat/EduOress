import { Link, useLocation } from 'react-router-dom'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { btnPrimary, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useCourses, useEnrollments, useLessons, useProgress } from '../../hooks/useData.js'

export default function MyCourses() {
  const { user } = useAuth()
  const location = useLocation()
  const { courses } = useCourses()
  const enrollments = useEnrollments().items.filter((e) => e.userId === user.id)
  const lessons = useLessons().items
  const done = new Set(useProgress().items.filter((p) => p.userId === user.id).map((p) => p.lessonId))

  const rows = enrollments
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId)
      if (!course) return null
      const ls = lessons.filter((l) => l.courseId === course.id && l.moderation === 'APPROVED')
      const doneCount = ls.filter((l) => done.has(l.id)).length
      const next = ls.find((l) => !done.has(l.id)) ?? ls[0]
      return { course, total: ls.length, doneCount, pct: ls.length ? Math.round((doneCount / ls.length) * 100) : 0, next }
    })
    .filter(Boolean)

  return (
    <div className={`${container} py-10`}>
      <h1 className="text-2xl font-bold">Khóa học của tôi</h1>
      {location.state?.justEnrolled && (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden /> Đăng ký thành công "{location.state.justEnrolled}".
        </p>
      )}
      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState icon={BookOpen} title="Bạn chưa đăng ký khóa học nào" text="Chọn một khóa học miễn phí hoặc trả phí để bắt đầu." action={<Link to="/khoa-hoc" className={btnPrimary}>Xem khóa học</Link>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ course, total, doneCount, pct, next }) => {
              const Icon = course.icon
              return (
                <article key={course.id} className="overflow-hidden rounded-card border border-line bg-white">
                  <div className={`grid aspect-[16/8] place-items-center bg-gradient-to-br ${course.tone}`}><Icon className="h-10 w-10 text-ink/70" aria-hidden /></div>
                  <div className="p-4">
                    <p className="text-xs text-muted">bởi {course.provider}</p>
                    <h2 className="mt-1 font-display text-[15px] font-semibold leading-snug">{course.title}</h2>
                    <div className="mt-4" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ học">
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} /></div>
                      <p className="mt-1.5 text-xs text-muted">{doneCount}/{total} bài · {pct}%</p>
                    </div>
                    {next ? (
                      <Link to={`/hoc/${course.slug}/${next.id}`} className={`${btnPrimary} mt-4 w-full`}>{doneCount ? (pct === 100 ? 'Xem lại' : 'Tiếp tục học') : 'Bắt đầu học'}</Link>
                    ) : (
                      <p className="mt-4 text-xs text-muted">Khóa học chưa có bài giảng được duyệt.</p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
