import { useState } from 'react'
import { Link } from 'react-router-dom'
import ManagePage from '../../../components/crud/ManagePage.jsx'
import { StatusBadge } from '../../../components/ui/Badge.jsx'
import { btnSm } from '../../../components/ui/styles.js'
import { useOwn } from '../../../hooks/useOwn.js'
import { useEnrollments, useLessons } from '../../../hooks/useData.js'
import { vnd } from '../../../lib/format.js'

export default function CourseManagement() {
  const { mine, update, remove } = useOwn()
  const lessons = useLessons()
  const enrollments = useEnrollments().items
  const [msg, setMsg] = useState('')

  const del = (c) => {
    if (enrollments.some((e) => e.courseId === c.id)) return setMsg(`"${c.title}" đã có học viên nên không xóa được. Hãy liên hệ quản trị viên để ngừng bán.`)
    remove(c.id)
    lessons.removeWhere((l) => l.courseId === c.id)
    setMsg('')
  }

  return (
    <>
      {msg && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-700">{msg}</p>}
      <ManagePage
        title="Khóa học của tôi"
        subtitle="Tạo khóa học, thêm bài giảng rồi gửi quản trị viên duyệt."
        newTo="/provider/courses/new"
        newLabel="Tạo khóa học"
        rows={mine}
        empty="Bạn chưa có khóa học nào."
        columns={[
          { header: 'Khóa học', cell: (c) => (
            <div><p className="font-medium">{c.title}</p><p className="text-xs text-muted">{c.category}</p>
              {c.status === 'REJECTED' && c.rejectReason && <p className="mt-1 text-xs text-sale">Lý do từ chối: {c.rejectReason}</p>}</div>) },
          { header: 'Trạng thái', cell: (c) => <StatusBadge status={c.status} /> },
          { header: 'Giá', cell: (c) => (c.price ? vnd(c.price) : 'Miễn phí') },
          { header: 'Học viên', key: 'students' },
          { header: 'Bài giảng', cell: (c) => lessons.items.filter((l) => l.courseId === c.id).length },
        ]}
        editTo={(c) => `/provider/courses/${c.id}/edit`}
        onDelete={del}
        deleteMessage={(c) => `Xóa khóa học "${c.title}" cùng toàn bộ bài giảng?`}
        extraActions={(c) => (
          <>
            <Link to={`/provider/courses/${c.id}/lessons`} className={btnSm}>Bài giảng</Link>
            {(c.status === 'DRAFT' || c.status === 'REJECTED') && (
              <button className={btnSm} onClick={() => update(c.id, { status: 'PENDING_REVIEW', rejectReason: '' })}>Gửi duyệt</button>
            )}
          </>
        )}
      />
    </>
  )
}
