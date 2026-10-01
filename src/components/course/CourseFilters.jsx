import { levelLabels } from '../../data/courses.js'
import Rating from '../ui/Rating.jsx'

export const emptyFilters = { categories: [], providers: [], price: 'all', minRating: 0, levels: [] }

const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function Group({ title, children }) {
  return (
    <fieldset className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <legend className="mb-3 font-display text-sm font-bold">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  )
}

function Row({ type = 'checkbox', name, checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-[13px] text-muted hover:text-ink">
      <span className="flex items-center gap-2">
        <input type={type} name={name} checked={checked} onChange={onChange} className="h-3.5 w-3.5 accent-brand" />
        {label}
      </span>
      {count !== undefined && <span className="text-xs">{count}</span>}
    </label>
  )
}

export default function CourseFilters({ courses, filters, onChange }) {
  const countBy = (fn) => courses.filter(fn).length
  const categories = [...new Set(courses.map((c) => c.category))]
  const providers = [...new Set(courses.map((c) => c.provider))]
  const active =
    filters.categories.length || filters.providers.length || filters.levels.length || filters.price !== 'all' || filters.minRating

  return (
    <div className="space-y-4">
      <Group title="Danh mục">
        {categories.map((c) => (
          <Row key={c} label={c} count={countBy((x) => x.category === c)}
            checked={filters.categories.includes(c)}
            onChange={() => onChange({ categories: toggle(filters.categories, c) })} />
        ))}
      </Group>

      <Group title="Nhà cung cấp">
        {providers.map((p) => (
          <Row key={p} label={p} count={countBy((x) => x.provider === p)}
            checked={filters.providers.includes(p)}
            onChange={() => onChange({ providers: toggle(filters.providers, p) })} />
        ))}
      </Group>

      <Group title="Giá">
        {[
          ['all', 'Tất cả', courses.length],
          ['free', 'Miễn phí', countBy((x) => x.price === 0)],
          ['paid', 'Trả phí', countBy((x) => x.price > 0)],
        ].map(([v, label, n]) => (
          <Row key={v} type="radio" name="price" label={label} count={n}
            checked={filters.price === v} onChange={() => onChange({ price: v })} />
        ))}
      </Group>

      <Group title="Đánh giá">
        {[4.5, 4, 3.5, 0].map((r) => (
          <Row key={r} type="radio" name="rating"
            label={r === 0 ? 'Tất cả' : (
              <span className="flex items-center gap-1.5"><Rating value={r} size="h-3 w-3" /> từ {r}</span>
            )}
            count={countBy((x) => x.rating >= r)}
            checked={filters.minRating === r} onChange={() => onChange({ minRating: r })} />
        ))}
      </Group>

      <Group title="Cấp độ">
        {Object.entries(levelLabels).map(([k, label]) => (
          <Row key={k} label={label} count={countBy((x) => x.level === k)}
            checked={filters.levels.includes(k)}
            onChange={() => onChange({ levels: toggle(filters.levels, k) })} />
        ))}
      </Group>

      {active ? (
        <button onClick={() => onChange(emptyFilters)} className="text-[13px] font-medium text-brand hover:underline">
          Xóa bộ lọc
        </button>
      ) : null}
    </div>
  )
}
