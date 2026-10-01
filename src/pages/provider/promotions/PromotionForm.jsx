import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ResourceForm from '../../../components/crud/ResourceForm.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { usePromotions } from '../../../hooks/useData.js'

export default function PromotionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, mine } = useOwn()
  const promos = usePromotions()
  const editing = id ? promos.items.find((p) => p.id === id && p.ownerId === user.id) : null
  if (id && !editing) return <Navigate to="/provider/promotions" replace />

  const fields = [
    { name: 'name', label: 'Tên chương trình', required: true, full: true },
    { name: 'type', label: 'Loại ưu đãi', type: 'select', options: [{ value: 'TIME_BASED', label: 'Theo thời gian' }, { value: 'QUOTA_BASED', label: 'Theo số lượt đăng ký' }] },
    { name: 'discountPercent', label: 'Phần trăm giảm', type: 'number', min: 1, max: 90, required: true },
    { name: 'startsAt', label: 'Bắt đầu', type: 'date', hint: 'Dùng cho ưu đãi theo thời gian.' },
    { name: 'endsAt', label: 'Kết thúc', type: 'date' },
    { name: 'maxEnrollments', label: 'Số lượt đăng ký tối đa', type: 'number', min: 1, hint: 'Dùng cho ưu đãi theo số lượt.' },
    { name: 'courseIds', label: 'Khóa học áp dụng', type: 'multi', required: true, options: mine.map((c) => ({ value: c.id, label: c.title })) },
    { name: 'active', label: 'Bật chương trình', type: 'checkbox' },
  ]
  const validate = (v) => {
    const e = {}
    if (v.type === 'TIME_BASED') {
      if (!v.startsAt) e.startsAt = 'Chọn ngày bắt đầu.'
      if (!v.endsAt) e.endsAt = 'Chọn ngày kết thúc.'
      else if (v.startsAt && v.endsAt < v.startsAt) e.endsAt = 'Ngày kết thúc phải sau ngày bắt đầu.'
    } else if (!v.maxEnrollments) e.maxEnrollments = 'Nhập số lượt tối đa.'
    return e
  }
  const save = (v) => {
    const data = { ...v, maxEnrollments: v.type === 'QUOTA_BASED' ? v.maxEnrollments : '' }
    if (editing) promos.update(editing.id, data)
    else promos.add({ ownerId: user.id, enrolledCount: 0, ...data })
    navigate('/provider/promotions')
  }
  return (
    <ResourceForm key={editing?.id ?? 'new'} title={editing ? 'Chỉnh sửa ưu đãi' : 'Tạo chương trình ưu đãi'} backTo="/provider/promotions"
      fields={fields} validate={validate} actions={[{ label: 'Lưu chương trình', handler: save }]}
      initial={editing ?? { type: 'TIME_BASED', active: true, courseIds: [] }} />
  )
}
