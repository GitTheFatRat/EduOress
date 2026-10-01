import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import FormField from '../../components/ui/FormField.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import Badge, { StatusBadge } from '../../components/ui/Badge.jsx'
import { Modal, useConfirm } from '../../components/ui/Modal.jsx'
import { btnOutline, btnPrimary, btnSm, btnSmDanger } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useDeletions } from '../../hooks/useData.js'
import { dateVN } from '../../lib/format.js'
import { roleLabels } from '../../lib/status.js'

const tabs = [{ id: 'users', label: 'Người dùng' }, { id: 'deletions', label: 'Yêu cầu xóa tài khoản' }]

export default function CustomerManagement() {
  const { users, updateUser } = useAuth()
  const deletions = useDeletions()
  const [tab, setTab] = useState('users')
  const [edit, setEdit] = useState(null)
  const [confirmUI, ask] = useConfirm()
  const list = users.filter((u) => u.role !== 'ADMIN')
  const reqs = [...deletions.items].reverse()

  const toggle = (u) => u.status === 'DISABLED'
    ? updateUser(u.id, { status: 'ACTIVE' })
    : ask(`Vô hiệu hóa tài khoản ${u.email}? Người dùng sẽ không đăng nhập được.`, () => updateUser(u.id, { status: 'DISABLED' }), { danger: true, okLabel: 'Vô hiệu hóa' })
  const approveDelete = (r) => ask(`Xóa tài khoản ${r.email}? Tài khoản sẽ bị vô hiệu hóa.`, () => { updateUser(r.userId, { status: 'DISABLED' }); deletions.update(r.id, { status: 'DONE' }) }, { danger: true, okLabel: 'Xóa tài khoản' })

  return (
    <>
      <PageHeader title="Người dùng" subtitle="Quản lý tài khoản khách hàng và nhà cung cấp." />
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Nhóm quản lý người dùng" />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="rounded-b-card border border-line bg-surface p-4">
        {tab === 'users' ? (
          <DataTable rows={list} columns={[
            { header: 'Người dùng', cell: (u) => <div><p className="font-medium">{u.fullName}</p><p className="text-xs text-muted">{u.email}</p></div> },
            { header: 'Vai trò', cell: (u) => <Badge tone={u.role === 'PROVIDER' ? 'brand' : 'gray'}>{roleLabels[u.role]}</Badge> },
            { header: 'Trạng thái', cell: (u) => <StatusBadge status={u.status} /> },
            { header: 'Thao tác', className: 'text-right', cell: (u) => (
              <div className="flex justify-end gap-1.5">
                <button className={btnSm} onClick={() => setEdit({ id: u.id, fullName: u.fullName, phone: u.phone ?? '' })}>Sửa</button>
                {u.status === 'DISABLED' ? <button className={btnSm} onClick={() => toggle(u)}>Kích hoạt</button> : <button className={btnSmDanger} onClick={() => toggle(u)}>Vô hiệu</button>}
              </div>) },
          ]} />
        ) : (
          <DataTable rows={reqs} empty="Chưa có yêu cầu xóa tài khoản." columns={[
            { header: 'Người dùng', cell: (r) => <div><p className="font-medium">{r.userName}</p><p className="text-xs text-muted">{r.email}</p></div> },
            { header: 'Lý do', key: 'reason' },
            { header: 'Ngày gửi', cell: (r) => dateVN(r.createdAt) },
            { header: 'Trạng thái', cell: (r) => <StatusBadge status={r.status ?? 'PENDING'} /> },
            { header: '', className: 'text-right', cell: (r) => (!r.status || r.status === 'PENDING') && (
              <div className="flex justify-end gap-1.5">
                <button className={btnSm} onClick={() => deletions.update(r.id, { status: 'REJECTED' })}>Từ chối</button>
                <button className={btnSmDanger} onClick={() => approveDelete(r)}>Xóa tài khoản</button>
              </div>) },
          ]} />
        )}
      </div>
      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title="Chỉnh sửa người dùng"
        footer={<><button className={btnOutline} onClick={() => setEdit(null)}>Hủy</button><button className={btnPrimary} disabled={!edit?.fullName?.trim()} onClick={() => { updateUser(edit.id, { fullName: edit.fullName.trim(), phone: edit.phone }); setEdit(null) }}>Lưu</button></>}>
        {edit && <div className="space-y-3">
          <FormField label="Họ và tên" value={edit.fullName} onChange={(e) => setEdit({ ...edit, fullName: e.target.value })} />
          <FormField label="Số điện thoại" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
        </div>}
      </Modal>
      {confirmUI}
    </>
  )
}
