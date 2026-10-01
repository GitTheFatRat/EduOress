import { Link, Navigate, useParams } from 'react-router-dom'
import ManagePage from '../../../components/crud/ManagePage.jsx'
import { StatusBadge } from '../../../components/ui/Badge.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { useLessons } from '../../../hooks/useData.js'
import { formatDuration } from '../../../data/lessons.js'

export default function LessonManagement() {
  const { id } = useParams()
  const { mine } = useOwn()
  const lessons = useLessons()
  const course = mine.find((c) => String(c.id) === id)
  if (!course) return <Navigate to="/provider/courses" replace />
  const rows = lessons.items.filter((l) => l.courseId === course.id)
  return (
    <ManagePage
      title={`Bài giảng: ${course.title}`}
      subtitle={<Link to="/provider/courses" className="hover:text-brand">← Về danh sách khóa học</Link>}
      newTo={`/provider/courses/${id}/lessons/new`}
      newLabel="Thêm bài giảng"
      rows={rows}
      empty="Khóa học chưa có bài giảng."
      columns={[
        { header: 'Chương', key: 'section' },
        { header: 'Bài giảng', cell: (l) => <span className="font-medium">{l.title}</span> },
        { header: 'Thời lượng', cell: (l) => formatDuration(l.durationSec) },
        { header: 'Xem thử', cell: (l) => (l.preview ? 'Có' : '—') },
        { header: 'Kiểm duyệt', cell: (l) => <StatusBadge status={l.moderation} /> },
      ]}
      editTo={(l) => `/provider/courses/${id}/lessons/${l.id}/edit`}
      onDelete={(l) => lessons.remove(l.id)}
      deleteMessage={(l) => `Xóa bài giảng "${l.title}"?`}
    />
  )
}
