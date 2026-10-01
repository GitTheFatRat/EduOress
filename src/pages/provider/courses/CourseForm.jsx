import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ResourceForm from '../../../components/crud/ResourceForm.jsx'
import { categoryOptions, iconLabels, levelLabels } from '../../../data/courses.js'
import { useOwn } from '../../../hooks/useOwn.js'
import { useProviders } from '../../../hooks/useData.js'
import { slugify } from '../../../lib/format.js'

const opts = (obj) => Object.entries(obj).map(([value, label]) => ({ value, label }))

const fields = [
  { name: 'title', label: 'Tên khóa học', required: true, full: true },
  { name: 'category', label: 'Danh mục', type: 'select', required: true, options: categoryOptions.map((c) => ({ value: c, label: c })) },
  { name: 'level', label: 'Cấp độ', type: 'select', options: opts(levelLabels) },
  { name: 'weeks', label: 'Thời lượng (tuần)', type: 'number', min: 1, max: 52, required: true },
  { name: 'iconName', label: 'Biểu tượng ảnh bìa', type: 'select', options: opts(iconLabels) },
  { name: 'price', label: 'Giá bán (₫)', type: 'number', min: 0, step: 1000, required: true, hint: 'Nhập 0 nếu miễn phí.' },
  { name: 'oldPrice', label: 'Giá gốc (₫)', type: 'number', min: 0, step: 1000, hint: 'Để hiển thị giá gạch ngang. Có thể bỏ trống.' },
  { name: 'description', label: 'Mô tả khóa học', type: 'textarea', required: true, hint: 'Cách nhau một dòng trống để tách đoạn.' },
  { name: 'objectives', label: 'Mục tiêu học tập', type: 'textarea', rows: 4, hint: 'Mỗi dòng một mục tiêu.' },
]

export default function CourseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, raw, add, update } = useOwn()
  const providers = useProviders().items
  const editing = id ? raw.find((c) => String(c.id) === id && c.ownerId === user.id) : null
  if (id && !editing) return <Navigate to="/provider/courses" replace />

  const build = (v) => ({
    title: v.title.trim(), category: v.category, level: v.level || 'all', weeks: v.weeks, price: v.price, oldPrice: v.oldPrice || 0,
    iconName: v.iconName || 'BookOpen', description: v.description.trim(),
    objectives: v.objectives.split('\n').map((s) => s.trim()).filter(Boolean),
  })
  const save = (status) => (v) => {
    if (editing) update(editing.id, { ...build(v), ...(status ? { status, rejectReason: '' } : {}) })
    else {
      const cid = Date.now()
      add({
        id: cid, slug: `${slugify(v.title)}-${String(cid).slice(-4)}`, ownerId: user.id,
        provider: providers.find((p) => p.userId === user.id)?.name ?? user.fullName,
        students: 0, seeded: false, status: status ?? 'DRAFT', ...build(v),
      })
    }
    navigate('/provider/courses')
  }

  const editable = !editing || editing.status === 'DRAFT' || editing.status === 'REJECTED'
  const actions = editable
    ? [{ label: 'Lưu bản nháp', kind: 'outline', handler: save(editing ? editing.status : 'DRAFT') }, { label: 'Lưu và gửi duyệt', handler: save('PENDING_REVIEW') }]
    : [{ label: 'Lưu thay đổi', handler: save(null) }]

  return (
    <ResourceForm
      key={editing?.id ?? 'new'}
      title={editing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
      subtitle="Khóa học cần được quản trị viên duyệt trước khi hiển thị công khai."
      backTo="/provider/courses"
      fields={fields}
      initial={editing ? { ...editing, description: editing.description, objectives: (editing.objectives || []).join('\n'), level: editing.level || 'all' } : { level: 'all', iconName: 'BookOpen', weeks: 4, price: 0 }}
      actions={actions}
    />
  )
}
