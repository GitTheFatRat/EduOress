import Breadcrumb from '../../components/ui/Breadcrumb.jsx'
import Accordion from '../../components/ui/Accordion.jsx'
import { container } from '../../components/ui/styles.js'
import { useFaqs } from '../../hooks/useData.js'

export default function Faq() {
  const items = useFaqs().items.filter((f) => !f.hidden)
  const half = Math.ceil(items.length / 2)
  const col = (list) => (
    <div className="space-y-3">
      {list.map((f) => (
        <Accordion key={f.id} title={f.question} className="bg-surface">
          <p className="px-4 py-3 text-[13px] leading-6 text-ink/75">{f.answer}</p>
        </Accordion>
      ))}
    </div>
  )
  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Câu hỏi thường gặp' }]} />
      <div className={`${container} py-10`}>
        <h1 className="text-2xl font-bold">Câu hỏi thường gặp</h1>
        <div className="mt-8 grid items-start gap-3 md:grid-cols-2 md:gap-6">{col(items.slice(0, half))}{col(items.slice(half))}</div>
        {items.length === 0 && <p className="mt-6 text-[13px] text-muted">Chưa có câu hỏi nào.</p>}
      </div>
    </>
  )
}
