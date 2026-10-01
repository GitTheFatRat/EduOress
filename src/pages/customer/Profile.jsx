import { useState } from 'react'
import FormField from '../../components/ui/FormField.jsx'
import PasswordToggle from '../../components/auth/PasswordToggle.jsx'
import { btnPrimary, card, container } from '../../components/ui/styles.js'
import { useAuth } from '../../hooks/useAuth.js'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, updateUser, changePassword } = useAuth()
  const [info, setInfo] = useState({ fullName: user.fullName, phone: user.phone ?? '', address: user.address ?? '' })
  const [infoErr, setInfoErr] = useState({})
  const [saved, setSaved] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState({})
  const [pwOk, setPwOk] = useState(false)
  const [show, setShow] = useState(false)

  const saveInfo = (e) => {
    e.preventDefault()
    const err = {}
    if (info.fullName.trim().length < 2) err.fullName = 'Nhập họ và tên.'
    if (info.phone && !/^[0-9 +]{9,15}$/.test(info.phone.trim())) err.phone = 'Số điện thoại chưa hợp lệ.'
    setInfoErr(err)
    if (Object.keys(err).length) return setSaved(false)
    updateUser(user.id, { fullName: info.fullName.trim(), phone: info.phone.trim(), address: info.address.trim() })
    setSaved(true)
  }

  const savePw = (e) => {
    e.preventDefault()
    const err = {}
    if (!pw.current) err.current = 'Nhập mật khẩu hiện tại.'
    if (pw.next.length < 6) err.next = 'Mật khẩu mới cần ít nhất 6 ký tự.'
    if (pw.confirm !== pw.next) err.confirm = 'Mật khẩu xác nhận chưa khớp.'
    if (!err.current && !err.next && !err.confirm) {
      const res = changePassword(pw.current, pw.next)
      if (!res.ok) err.current = res.error
    }
    setPwErr(err)
    setPwOk(!Object.keys(err).length)
    if (!Object.keys(err).length) setPw({ current: '', next: '', confirm: '' })
  }

  const type = show ? 'text' : 'password'
  const setI = (k) => (e) => { setSaved(false); setInfo({ ...info, [k]: e.target.value }) }
  const setP = (k) => (e) => { setPwOk(false); setPw({ ...pw, [k]: e.target.value }) }

  return (
    <div className={`${container} max-w-3xl py-10`}>
      <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>

      <form onSubmit={saveInfo} noValidate className={`${card} mt-6 grid gap-5 p-6 md:grid-cols-2`}>
        <h2 className="font-display text-base font-bold md:col-span-2">Thông tin cá nhân</h2>
        <FormField label="Email" value={user.email} disabled hint="Email không thể thay đổi." className="md:col-span-2" />
        <FormField label="Họ và tên" value={info.fullName} onChange={setI('fullName')} error={infoErr.fullName} />
        <FormField label="Số điện thoại" value={info.phone} onChange={setI('phone')} error={infoErr.phone} />
        <FormField label="Địa chỉ" value={info.address} onChange={setI('address')} className="md:col-span-2" />
        <div className="flex items-center gap-3 md:col-span-2">
          <button className={btnPrimary}>Lưu thay đổi</button>
          {saved && <p role="status" className="text-[13px] text-free">Đã lưu thông tin.</p>}
        </div>
      </form>

      <form onSubmit={savePw} noValidate className={`${card} mt-6 grid gap-5 p-6`}>
        <h2 className="font-display text-base font-bold">Đổi mật khẩu</h2>
        <FormField label="Mật khẩu hiện tại" type={type} autoComplete="current-password" value={pw.current} onChange={setP('current')} error={pwErr.current}
          right={<PasswordToggle shown={show} onToggle={() => setShow((v) => !v)} />} />
        <FormField label="Mật khẩu mới" type={type} autoComplete="new-password" value={pw.next} onChange={setP('next')} error={pwErr.next} hint="Ít nhất 6 ký tự." />
        <FormField label="Xác nhận mật khẩu mới" type={type} autoComplete="new-password" value={pw.confirm} onChange={setP('confirm')} error={pwErr.confirm} />
        <div className="flex items-center gap-3">
          <button className={btnPrimary}>Đổi mật khẩu</button>
          {pwOk && <p role="status" className="text-[13px] text-free">Đã đổi mật khẩu.</p>}
        </div>
      </form>

      <p className="mt-6 text-[13px] text-muted">
        Không muốn dùng tài khoản nữa? <Link to="/xoa-tai-khoan" className="text-sale hover:underline">Yêu cầu xóa tài khoản</Link>
      </p>
    </div>
  )
}
