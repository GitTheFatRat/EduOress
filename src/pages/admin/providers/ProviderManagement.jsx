import { useState } from 'react'
import DataTable from '../../../components/ui/DataTable.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import FormField from '../../../components/ui/FormField.jsx'
import { Modal, useConfirm } from '../../../components/ui/Modal.jsx'
import { StatusBadge } from '../../../components/ui/Badge.jsx'
import { btnOutline, btnPrimary, btnSm, btnSmDanger } from '../../../components/ui/styles.js'
import { useCourses, useProviders } from '../../../hooks/useData.js'

export default function ProviderManagement() {
  const providers = useProviders()
  const courses = useCourses()
  const [confirmUI, ask] = useConfirm()
  const [edit, setEdit] = useState(null)
  const rows = providers.items.filter((p) => p.status !== 'PENDING')

  const toggle = (p) => {
    if (p.status === 'SUSPENDED') return ask(`Kích hoạt lại "${p.name}"? Các khóa học đã bị ngừng bán cần được bật lại ở mục Quản lý khóa học.`, () => providers.update(p.id, { status: 'APPROVED' }), { okLabel: 'Kích hoạt' })
    ask(`Đình chỉ "${p.name}"? Toàn bộ khóa học đang bán của nhà cung cấp sẽ bị ngừng bán.`, () => {
      providers.update(p.id, { status: 'SUSPENDED' })
      courses.raw.filter((c) => c.provider === p.name && c.status === 'PUBLISHED').forEach((c) => courses.update(c.id, { status: 'DISABLED' }))
    }, { danger: true, okLabel: 'Đình chỉ' })
  }

  return (
    <>
      <PageHeader title="Quản lý nhà cung cấp" />
      <DataTable rows={rows} columns={[
        { header: 'Nhà cung cấp', cell: (p) => <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted">{p.email}</p></div> },
        { header: 'Khóa học', cell: (p) => courses.raw.filter((c) => c.provider === p.name).length },
        { header: 'Học viên', cell: (p) => courses.raw.filter((c) => c.provider === p.name).reduce((n, c) => n + (c.students || 0), 0) },
        { header: 'Trạng thái', cell: (p) => <StatusBadge status={p.status} /> },
        { header: 'Thao tác', className: 'text-right', cell: (p) => (
          <div className="flex justify-end gap-1.5">
            <button className={btnSm} onClick={() => setEdit({ ...p })}>Sửa</button>
            {p.status === 'SUSPENDED' ? <button className={btnSm} onClick={() => toggle(p)}>Kích hoạt</button> : p.status === 'APPROVED' ? <button className={btnSmDanger} onClick={() => toggle(p)}>Đình chỉ</button> : null}
          </div>) },
      ]} />
      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title="Chỉnh sửa nhà cung cấp"
        footer={<><button className={btnOutline} onClick={() => setEdit(null)}>Hủy</button><button className={btnPrimary} disabled={!edit?.name?.trim()} onClick={() => { providers.update(edit.id, { name: edit.name.trim(), contact: edit.contact, bio: edit.bio }); setEdit(null) }}>Lưu</button></>}>
        {edit && <div className="space-y-3">
          <FormField label="Tên hiển thị" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
          <FormField label="Liên hệ" value={edit.contact ?? ''} onChange={(e) => setEdit({ ...edit, contact: e.target.value })} />
          <FormField as="textarea" rows={3} label="Giới thiệu" value={edit.bio ?? ''} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} />
        </div>}
      </Modal>
      {confirmUI}
    </>
  )
}
