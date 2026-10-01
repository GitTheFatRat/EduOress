import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField, { CheckField } from '../ui/FormField.jsx'
import PageHeader from '../ui/PageHeader.jsx'
import { btnOutline, btnPrimary, card } from '../ui/styles.js'

export default function ResourceForm({ title, subtitle, backTo, fields, initial = {}, actions, validate }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, initial[f.name] ?? (f.type === 'checkbox' ? false : f.type === 'multi' ? [] : '')])))
  const [errors, setErrors] = useState({})
  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  const run = (handler) => (e) => {
    e.preventDefault()
    const next = {}
    fields.forEach((f) => {
      const v = values[f.name]
      const empty = v === '' || v === undefined || (Array.isArray(v) && !v.length)
      if (f.required && empty) next[f.name] = 'Trường này là bắt buộc.'
      else if (f.type === 'number' && v !== '' && (Number(v) < (f.min ?? -Infinity) || Number(v) > (f.max ?? Infinity)))
        next[f.name] = `Nhập số từ ${f.min ?? '−∞'}${f.max !== undefined ? ` đến ${f.max}` : ''}.`
    })
    Object.assign(next, validate?.(values) ?? {})
    setErrors(next)
    if (Object.keys(next).length) return
    const out = { ...values }
    fields.forEach((f) => { if (f.type === 'number' && out[f.name] !== '') out[f.name] = Number(out[f.name]) })
    handler(out)
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={title} subtitle={subtitle} actions={backTo && <Link to={backTo} className={btnOutline}>Quay lại</Link>} />
      <form className={`${card} grid gap-5 p-6 md:grid-cols-2`} noValidate onSubmit={(e) => e.preventDefault()}>
        {fields.map((f) => {
          const full = f.full || f.type === 'textarea' || f.type === 'multi' ? 'md:col-span-2' : ''
          if (f.type === 'checkbox')
            return <div key={f.name} className={full || 'md:col-span-2'}><CheckField label={f.label} hint={f.hint} checked={values[f.name]} onChange={(e) => set(f.name, e.target.checked)} /></div>
          if (f.type === 'multi')
            return (
              <fieldset key={f.name} className="md:col-span-2">
                <legend className="mb-1.5 text-[13px] font-medium">{f.label}</legend>
                <div className="space-y-2 rounded-lg border border-line p-3">
                  {f.options.length === 0 && <p className="text-xs text-muted">Chưa có lựa chọn nào.</p>}
                  {f.options.map((o) => (
                    <CheckField key={o.value} label={o.label}
                      checked={values[f.name].includes(o.value)}
                      onChange={(e) => set(f.name, e.target.checked ? [...values[f.name], o.value] : values[f.name].filter((x) => x !== o.value))} />
                  ))}
                </div>
                {errors[f.name] && <p role="alert" className="mt-1.5 text-xs text-sale">{errors[f.name]}</p>}
              </fieldset>
            )
          const isSelect = f.type === 'select'
          return (
            <FormField key={f.name} className={full} label={f.label} hint={f.hint} error={errors[f.name]}
              as={f.type === 'textarea' ? 'textarea' : isSelect ? 'select' : 'input'}
              type={isSelect || f.type === 'textarea' ? undefined : f.type ?? 'text'}
              rows={f.type === 'textarea' ? f.rows ?? 5 : undefined}
              min={f.min} max={f.max} step={f.type === 'number' ? f.step ?? 1 : undefined} placeholder={f.placeholder}
              value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
              {isSelect && f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </FormField>
          )
        })}
        <div className="flex flex-wrap gap-2 md:col-span-2">
          {actions.map((a) => (
            <button key={a.label} type="button" className={a.kind === 'outline' ? btnOutline : btnPrimary} onClick={run(a.handler)}>{a.label}</button>
          ))}
        </div>
      </form>
    </div>
  )
}
