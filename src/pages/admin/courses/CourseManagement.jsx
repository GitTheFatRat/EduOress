import { useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../../components/ui/DataTable.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import FormField from '../../../components/ui/FormField.jsx'
import { Modal, useConfirm } from '../../../components/ui/Modal.jsx'
import { StatusBadge } from '../../../components/ui/Badge.jsx'
import { btnOutline, btnPrimary, btnSm, btnSmDanger } from '../../../components/ui/styles.js'
import { categoryOptions } from '../../../data/courses.js'
import { useCourses } from '../../../hooks/useData.js'
import { vnd } from '../../../lib/format.js'

export default function CourseManagement() {
  const { courses, update } = useCourses()
  const [confirmUI, ask] = useConfirm()
  const [edit, setEdit] = useState(null)
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value })
  return (
    <>
      <PageHeader title="Quản lý khóa học" subtitle="Xem, chỉnh sửa hoặc ngừng bán các khóa học trên hệ thống." />
      <DataTable rows={courses} columns={[
        { header: 'Khóa học', cell: (c) => <div><p className="font-medium">{c.title}</p><p className="text-xs text-muted">{c.provider} · {c.category}</p></div> },
        { header: 'Giá', cell: (c) => (c.price ? vnd(c.price) : 'Miễn phí') },
        { header: 'Học viên', key: 'students' },
        { header: 'Trạng thái', cell: (c) => <StatusBadge status={c.status} /> },
        { header: 'Thao tác', className: 'text-right', cell: (c) => (
          <div className="flex flex-wrap justify-end gap-1.5">
            <Link to={`/admin/courses/${c.id}/content`} className={btnSm}>Nội dung</Link>
            <button className={btnSm} onClick={() => setEdit({ id: c.id, title: c.title, category: c.category, price: c.price })}>Sửa</button>
            {c.status === 'PUBLISHED' && <button className={btnSmDanger} onClick={() => ask(`Ngừng bán "${c.title}"? Khóa học sẽ biến mất khỏi trang công khai.`, () => update(c.id, { status: 'DISABLED' }), { danger: true, okLabel: 'Ngừng bán' })}>Vô hiệu</button>}
            {c.status === 'DISABLED' && <button className={btnSm} onClick={() => update(c.id, { status: 'PUBLISHED' })}>Bật lại</button>}
          </div>) },
      ]} />
      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title="Chỉnh sửa khóa học"
        footer={<><button className={btnOutline} onClick={() => setEdit(null)}>Hủy</button><button className={btnPrimary} disabled={!edit?.title?.trim() || Number(edit?.price) < 0} onClick={() => { update(edit.id, { title: edit.title.trim(), category: edit.category, price: Number(edit.price) }); setEdit(null) }}>Lưu</button></>}>
        {edit && <div className="space-y-3">
          <FormField label="Tên khóa học" value={edit.title} onChange={set('title')} />
          <FormField as="select" label="Danh mục" value={edit.category} onChange={set('category')}>{categoryOptions.map((c) => <option key={c}>{c}</option>)}</FormField>
          <FormField label="Giá (₫)" type="number" min={0} step={1000} value={edit.price} onChange={set('price')} />
        </div>}
      </Modal>
      {confirmUI}
    </>
  )
}
