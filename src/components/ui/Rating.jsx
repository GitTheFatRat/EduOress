import { Star } from 'lucide-react'

export default function Rating({ value, size = 'h-4 w-4', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${value.toFixed(1)} trên 5 sao`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={`${size} ${value >= i - 0.5 ? 'fill-amber-400 text-amber-400' : 'text-line'}`}
        />
      ))}
    </span>
  )
}
