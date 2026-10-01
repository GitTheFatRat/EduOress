import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ResourceForm from '../../../components/crud/ResourceForm.jsx'
import { useOwn } from '../../../hooks/useOwn.js'
import { useDiscounts } from '../../../hooks/useData.js'

export default function DiscountForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, mine } = useOwn()
  const discounts = useDiscounts()
  const editing = id ? discounts.items.find((d) => d.id === id && d.ownerId === user.id) : null
  if (id && !editing) return <Navigate to="/provider/discounts" replace />

  const fields = [
    { name: 'code', label: 'Mã giảm giá', required: true, hint: 'Chữ và số, không dấu. Ví dụ: LUMEN20.' },
    { name: 'courseId', label: 'Áp dụng cho', type: 'select', options: [{ value: '', label: 'Tất cả khóa học của tôi' }, ...mine.map((c) => ({ value: String(c.id), label: c.title }))] },
    { name: 'type', label: 'Loại giảm', type: 'select', options: [{ value: 'PERCENT', label: 'Theo phần trăm (%)' }, { value: 'FIXED', label: 'Số tiền cố định (₫)' }] },
    { name: 'value', label: 'Giá trị giảm', type: 'number', min: 1, required: true },
    { name: 'maxUses', label: 'Số lượt dùng tối đa', type: 'number', min: 0, hint: 'Nhập 0 nếu không giới hạn.' },
    { name: 'expiresAt', label: 'Hết hạn vào ngày', type: 'date' },
    { name: 'active', label: 'Bật mã này', type: 'checkbox' },
  ]
  const validate = (v) => {
    const e = {}
    if (!/^[A-Za-z0-9]{3,20}$/.test(v.code.trim())) e.code = 'Mã gồm 3 đến 20 chữ hoặc số, không dấu.'
    else if (discounts.items.some((d) => d.code === v.code.trim().toUpperCase() && d.id !== editing?.id)) e.code = 'Mã này đã tồn tại.'
    if (v.type === 'PERCENT' && Number(v.value) > 100) e.value = 'Phần trăm giảm tối đa là 100.'
    return e
  }
  const save = (v) => {
    const data = { ...v, code: v.code.trim().toUpperCase(), maxUses: v.maxUses || 0 }
    if (editing) discounts.update(editing.id, data)
    else discounts.add({ ownerId: user.id, usedCount: 0, startsAt: '', ...data })
    navigate('/provider/discounts')
  }
  return (
    <ResourceForm key={editing?.id ?? 'new'} title={editing ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá'} backTo="/provider/discounts"
      fields={fields} validate={validate} actions={[{ label: 'Lưu mã', handler: save }]}
      initial={editing ?? { type: 'PERCENT', active: true, courseId: '' }} />
  )
}
