import { useState } from 'react'
import { Modal } from './Modal.jsx'
import FormField from './FormField.jsx'
import { btnDanger, btnOutline } from './styles.js'

export default function ReasonModal({ open, title, onClose, onSubmit, okLabel = 'Từ chối' }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const close = () => { setReason(''); setError(''); onClose() }
  const submit = () => {
    if (reason.trim().length < 5) return setError('Nhập lý do ít nhất 5 ký tự.')
    onSubmit(reason.trim())
    close()
  }
  return (
    <Modal open={open} onClose={close} title={title}
      footer={<><button className={btnOutline} onClick={close}>Hủy</button><button className={btnDanger} onClick={submit}>{okLabel}</button></>}>
      <FormField as="textarea" rows={4} label="Lý do" value={reason} onChange={(e) => setReason(e.target.value)} error={error} />
    </Modal>
  )
}
