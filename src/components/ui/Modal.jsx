import { useEffect, useRef, useState } from 'react'
import { btnDanger, btnOutline, btnPrimary } from './styles.js'

export function Modal({ open, onClose, title, children, footer, wide }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose() }}
      className={`m-auto w-[min(92vw,${wide ? '720px' : '480px'})] rounded-card p-0 backdrop:bg-black/40`}
      style={{ width: `min(92vw, ${wide ? 720 : 480}px)` }}
    >
      {open && (
        <div className="p-6">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <div className="mt-4 text-[13px] leading-6">{children}</div>
          {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
        </div>
      )}
    </dialog>
  )
}

export function useConfirm() {
  const [s, setS] = useState(null)
  const close = () => setS(null)
  const ask = (message, onYes, opt = {}) => setS({ message, onYes, title: 'Xác nhận', okLabel: 'Đồng ý', ...opt })
  const ui = (
    <Modal
      open={Boolean(s)}
      onClose={close}
      title={s?.title}
      footer={<>
        <button className={btnOutline} onClick={close}>Hủy</button>
        <button className={s?.danger ? btnDanger : btnPrimary} onClick={() => { s.onYes(); close() }}>{s?.okLabel}</button>
      </>}
    >
      {s?.message}
    </Modal>
  )
  return [ui, ask]
}
