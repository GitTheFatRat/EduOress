import { Link, Navigate, useParams } from 'react-router-dom'
import DataTable from '../../../components/ui/DataTable.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import { StatusBadge } from '../../../components/ui/Badge.jsx'
import { btnOutline, btnSm, btnSmDanger } from '../../../components/ui/styles.js'
import { useCourses, useLessons, useNotifications } from '../../../hooks/useData.js'
import { formatDuration } from '../../../data/lessons.js'

export default function CourseContent() {
  const { id } = useParams()
  const { courses } = useCourses()
  const lessons = useLessons()
  const { notify } = useNotifications()
  const course = courses.find((c) => String(c.id) === id)
  if (!course) return <Navigate to="/admin/courses" replace />

  const flag = (l) => {
    lessons.update(l.id, { moderation: 'FLAGGED' })
    if (course.ownerId) notify(course.ownerId, 'Bài giảng bị đánh dấu vi phạm', `Bài "${l.title}" trong "${course.title}" đã bị ẩn. Vui lòng chỉnh sửa nội dung.`, 'COURSE')
  }
  return (
    <>
      <PageHeader title={`Nội dung: ${course.title}`} subtitle="Duyệt hoặc đánh dấu vi phạm từng bài giảng. Bài vi phạm bị ẩn khỏi học viên."
        actions={<Link to="/admin/courses" className={btnOutline}>Quay lại</Link>} />
      <DataTable rows={lessons.items.filter((l) => l.courseId === course.id)} empty="Khóa học chưa có bài giảng." columns={[
        { header: 'Chương', key: 'section' },
        { header: 'Bài giảng', cell: (l) => <span className="font-medium">{l.title}</span> },
        { header: 'Thời lượng', cell: (l) => formatDuration(l.durationSec) },
        { header: 'Video', cell: (l) => <a href={l.videoUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">Xem</a> },
        { header: 'Kiểm duyệt', cell: (l) => <StatusBadge status={l.moderation} /> },
        { header: 'Thao tác', className: 'text-right', cell: (l) => (
          <div className="flex justify-end gap-1.5">
            {l.moderation !== 'APPROVED' && <button className={btnSm} onClick={() => lessons.update(l.id, { moderation: 'APPROVED' })}>Duyệt</button>}
            {l.moderation !== 'FLAGGED' && <button className={btnSmDanger} onClick={() => flag(l)}>Vi phạm</button>}
          </div>) },
      ]} />
    </>
  )
}
