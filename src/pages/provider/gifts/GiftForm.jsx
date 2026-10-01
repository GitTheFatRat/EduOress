import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ResourceForm from '../../../components/crud/ResourceForm.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { useGifts } from '../../../hooks/useData.js'

export default function GiftForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, mine } = useOwn()
  const gifts = useGifts()
  const editing = id ? gifts.items.find((g) => g.id === id && g.ownerId === user.id) : null
  if (id && !editing) return <Navigate to="/provider/gifts" replace />

  const fields = [
    { name: 'courseId', label: 'Khóa học', type: 'select', required: true, options: [{ value: '', label: 'Chọn khóa học' }, ...mine.map((c) => ({ value: String(c.id), label: c.title }))] },
    { name: 'name', label: 'Tên quà tặng', required: true },
    { name: 'description', label: 'Mô tả', type: 'textarea', rows: 3 },
    { name: 'fileUrl', label: 'Đường dẫn tải quà (nếu có)', full: true },
  ]
  const save = (v) => {
    const data = { ...v, courseId: Number(v.courseId) }
    if (editing) gifts.update(editing.id, data)
    else gifts.add({ ownerId: user.id, ...data })
    navigate('/provider/gifts')
  }
  return (
    <ResourceForm key={editing?.id ?? 'new'} title={editing ? 'Chỉnh sửa quà tặng' : 'Thêm quà tặng'} backTo="/provider/gifts"
      fields={fields} actions={[{ label: 'Lưu quà tặng', handler: save }]}
      initial={editing ? { ...editing, courseId: String(editing.courseId) } : { courseId: '' }} />
  )
}
