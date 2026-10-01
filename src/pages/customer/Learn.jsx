import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, Lock, PlayCircle } from 'lucide-react'
import Accordion from '../../components/ui/Accordion.jsx'
import { btnOutline, btnPrimary, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useCourses, useIsEnrolled, useLessons, useProgress } from '../../hooks/useData.js'
import { SAMPLE_VIDEO } from '../../data/seeds.js'
import { formatDuration, groupSections } from '../../data/lessons.js'

export default function Learn() {
  const { slug, lessonId } = useParams()
  const { user } = useAuth()
  const { courses } = useCourses()
  const course = courses.find((c) => c.slug === slug && (c.status === 'PUBLISHED' || user?.role === 'ADMIN' || c.ownerId === user?.id))
  const all = useLessons().items
  const enrolled = useIsEnrolled(user, course)
  const progress = useProgress()
  const lessons = useMemo(() => (course ? all.filter((l) => l.courseId === course.id && l.moderation === 'APPROVED') : []), [course, all])

  if (!course) return <Navigate to="/khoa-hoc" replace />
  if (!lessons.length)
    return <div className={`${container} py-24 text-center`}><h1 className="text-xl font-bold">Khóa học chưa có bài giảng</h1><Link to={`/khoa-hoc/${slug}`} className={`${btnOutline} mt-5`}>Quay lại khóa học</Link></div>

  const done = new Set(progress.items.filter((p) => p.userId === user.id && p.courseId === course.id).map((p) => p.lessonId))
  const lesson = lessons.find((l) => l.id === lessonId)
  if (!lesson) return <Navigate to={`/hoc/${slug}/${(lessons.find((l) => !done.has(l.id)) ?? lessons[0]).id}`} replace />

  const privileged = user.role === 'ADMIN' || course.ownerId === user.id
  const canWatch = enrolled || lesson.preview || privileged
  const idx = lessons.indexOf(lesson)
  const prev = lessons[idx - 1]
  const next = lessons[idx + 1]
  const pct = Math.round((done.size / lessons.length) * 100)
  const isDone = done.has(lesson.id)
  const progressId = `${user.id}:${lesson.id}`

  const markDone = () => !isDone && enrolled && progress.add({ id: progressId, userId: user.id, courseId: course.id, lessonId: lesson.id })
  const toggleDone = () => (isDone ? progress.remove(progressId) : markDone())

  return (
    <div className={`${container} py-8`}>
      <nav aria-label="Đường dẫn" className="mb-4 text-xs text-muted">
        <Link to="/hoc-tap" className="hover:text-brand">Khóa học của tôi</Link> / <Link to={`/khoa-hoc/${slug}`} className="hover:text-brand">{course.title}</Link>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          {canWatch ? (
            <video key={lesson.id} controls className="aspect-video w-full rounded-card bg-ink" src={lesson.videoUrl || SAMPLE_VIDEO} onEnded={markDone}>
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          ) : (
            <div className="grid aspect-video place-items-center rounded-card bg-ink px-6 text-center text-white">
              <div>
                <Lock className="mx-auto h-10 w-10" aria-hidden />
                <p className="mt-3 font-semibold">Bài học này dành cho học viên đã đăng ký</p>
                <Link to={`/thanh-toan/${slug}`} className={`${btnPrimary} mt-4`}>Đăng ký khóa học</Link>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted">Bài {idx + 1}/{lessons.length} · {lesson.section}</p>
              <h1 className="mt-1 font-display text-xl font-bold">{lesson.title}</h1>
            </div>
            {enrolled && (
              <button onClick={toggleDone} aria-pressed={isDone} className={isDone ? `${btnOutline} border-free text-free` : btnPrimary}>
                <CheckCircle2 className="h-4 w-4" aria-hidden /> {isDone ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
              </button>
            )}
          </div>

          {lesson.resource && (
            <a href={lesson.resource} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[13px] hover:border-brand hover:text-brand">
              <FileText className="h-4 w-4" aria-hidden /> Tài liệu bài học
            </a>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            {prev ? <Link to={`/hoc/${slug}/${prev.id}`} className={btnOutline}><ChevronLeft className="h-4 w-4" aria-hidden />Bài trước</Link> : <span />}
            {next ? <Link to={`/hoc/${slug}/${next.id}`} className={btnPrimary}>Bài tiếp<ChevronRight className="h-4 w-4" aria-hidden /></Link> : <span className="text-[13px] text-muted">Đây là bài cuối cùng</span>}
          </div>

          {enrolled && (
            <p className="mt-6 rounded-lg bg-surface px-4 py-3 text-[13px]">
              Bạn thấy khóa học thế nào? <Link to={`/khoa-hoc/${slug}`} className="font-medium text-brand hover:underline">Viết đánh giá</Link>
            </p>
          )}
        </section>

        <aside aria-label="Danh sách bài học">
          <div className="rounded-card border border-line bg-white p-4">
            <p className="text-[13px] font-semibold">Tiến độ: {pct}%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} /></div>
          </div>
          <div className="mt-3 space-y-2">
            {groupSections(lessons).map((s) => (
              <Accordion key={s.id} title={s.title} defaultOpen={s.lessons.some((l) => l.id === lesson.id)} className="border border-line">
                <ul>
                  {s.lessons.map((l) => {
                    const open = enrolled || l.preview || privileged
                    return (
                      <li key={l.id}>
                        <Link to={`/hoc/${slug}/${l.id}`} aria-current={l.id === lesson.id ? 'true' : undefined}
                          className={`flex items-center gap-2.5 border-b border-line px-4 py-2.5 text-[13px] last:border-b-0 hover:bg-surface ${l.id === lesson.id ? 'bg-brand-soft text-brand' : ''}`}>
                          {done.has(l.id) ? <CheckCircle2 className="h-4 w-4 shrink-0 text-free" aria-label="Đã học" /> : open ? <PlayCircle className="h-4 w-4 shrink-0 text-muted" aria-hidden /> : <Lock className="h-3.5 w-3.5 shrink-0 text-muted" aria-label="Chưa mở" />}
                          <span className="flex-1">{l.title}</span>
                          <span className="text-xs text-muted">{formatDuration(l.durationSec)}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </Accordion>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
