import { Eye, EyeOff } from 'lucide-react'

export default function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      aria-pressed={shown}
      className="grid h-8 w-8 place-items-center rounded text-muted hover:text-ink"
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )
}
