import { useId } from 'react'

export default function FormField({ label, error, hint, right, as = 'input', className = '', children, ...props }) {
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  const Tag = as
  const size = as === 'textarea' ? 'py-2.5' : 'h-11'
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium">{label}</label>
      <div className="relative">
        <Tag
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-lg border bg-white px-3.5 text-sm outline-none transition focus:border-brand ${size} ${error ? 'border-sale' : 'border-line'} ${right ? 'pr-11' : ''}`}
          {...props}
          {...(as === 'select' ? { children } : {})}
        />
        {right && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{right}</div>}
      </div>
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-sale">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function CheckField({ label, hint, ...props }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-[13px]">
      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand" {...props} />
      <span>{label}{hint && <span className="block text-xs text-muted">{hint}</span>}</span>
    </label>
  )
}
