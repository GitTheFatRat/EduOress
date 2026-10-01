import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ResourceForm from '../../../components/crud/ResourceForm.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { useLessons } from '../../../hooks/useData.js'

const fields = [
  { name: 'section', label: 'Chương', required: true, hint: 'Nhập cùng tên để gom bài vào một chương.' },
  { name: 'title', label: 'Tên bài giảng', required: true },
  { name: 'durationMin', label: 'Thời lượng (phút)', type: 'number', min: 1, max: 600, required: true },
  { name: 'videoUrl', label: 'Đường dẫn video (.mp4)', hint: 'Để trống sẽ dùng video mẫu.' },
  { name: 'resource', label: 'Đường dẫn tài liệu', full: true },
  { name: 'preview', label: 'Cho xem thử miễn phí', type: 'checkbox' },
]

export default function LessonForm() {
  const { id, lessonId } = useParams()
  const navigate = useNavigate()
  const { mine } = useOwn()
  const lessons = useLessons()
  const course = mine.find((c) => String(c.id) === id)
  const editing = lessonId ? lessons.items.find((l) => l.id === lessonId && l.courseId === course?.id) : null
  if (!course || (lessonId && !editing)) return <Navigate to="/provider/courses" replace />

  const save = (v) => {
    const data = { section: v.section.trim(), title: v.title.trim(), durationSec: v.durationMin * 60, videoUrl: v.videoUrl.trim(), resource: v.resource.trim(), preview: v.preview }
    if (editing) lessons.update(editing.id, data)
    else lessons.add({ courseId: course.id, moderation: course.status === 'PUBLISHED' ? 'APPROVED' : 'PENDING', ...data })
    navigate(`/provider/courses/${id}/lessons`)
  }

  return (
    <ResourceForm
      key={editing?.id ?? 'new'}
      title={editing ? 'Chỉnh sửa bài giảng' : 'Thêm bài giảng'}
      subtitle={course.title}
      backTo={`/provider/courses/${id}/lessons`}
      fields={fields}
      initial={editing ? { ...editing, durationMin: Math.round(editing.durationSec / 60) } : { durationMin: 10 }}
      actions={[{ label: 'Lưu bài giảng', handler: save }]}
    />
  )
}
