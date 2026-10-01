import { useState } from 'react'
import DataTable from '../../components/ui/DataTable.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import FormField from '../../components/ui/FormField.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useConfirm } from '../../components/ui/Modal.jsx'
import { btnPrimary, btnSm, btnSmDanger, card } from '../../components/ui/styles.js'
import { useFaqs, usePosts } from '../../hooks/useData.js'
import { dateVN } from '../../lib/format.js'

const tabs = [{ id: 'posts', label: 'Bài viết' }, { id: 'faqs', label: 'Câu hỏi thường gặp' }]

export default function SystemContent() {
  const posts = usePosts()
  const faqs = useFaqs()
  const [tab, setTab] = useState('posts')
  const [confirmUI, ask] = useConfirm()
  const [form, setForm] = useState({ question: '', answer: '' })
  const [err, setErr] = useState({})

  const visibility = (x) => <Badge tone={x.hidden ? 'gray' : 'green'}>{x.hidden ? 'Đang ẩn' : 'Hiển thị'}</Badge>
  const actions = (store, label) => (x) => (
    <div className="flex justify-end gap-1.5">
      <button className={btnSm} onClick={() => store.update(x.id, { hidden: !x.hidden })}>{x.hidden ? 'Hiện' : 'Ẩn'}</button>
      <button className={btnSmDanger} onClick={() => ask(`Xóa ${label} này vĩnh viễn?`, () => store.remove(x.id), { danger: true, okLabel: 'Xóa' })}>Xóa</button>
    </div>
  )
  const addFaq = (e) => {
    e.preventDefault()
    const next = {}
    if (form.question.trim().length < 5) next.question = 'Nhập câu hỏi.'
    if (form.answer.trim().length < 5) next.answer = 'Nhập câu trả lời.'
    setErr(next)
    if (Object.keys(next).length) return
    faqs.add({ question: form.question.trim(), answer: form.answer.trim(), hidden: false })
    setForm({ question: '', answer: '' })
  }

  return (
    <>
      <PageHeader title="Nội dung hệ thống" subtitle="Kiểm tra nội dung hiển thị công khai. Nội dung bị ẩn không còn thấy ở trang Blog và FAQ." />
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Loại nội dung" />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="rounded-b-card border border-line bg-surface p-4">
        {tab === 'posts' ? (
          <DataTable rows={[...posts.items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))} columns={[
            { header: 'Bài viết', cell: (p) => <div><p className="font-medium">{p.title}</p><p className="text-xs text-muted">{p.category} · {dateVN(p.createdAt)}</p></div> },
            { header: 'Trạng thái', cell: visibility },
            { header: '', className: 'text-right', cell: actions(posts, 'bài viết') },
          ]} />
        ) : (
          <div className="space-y-4">
            <form onSubmit={addFaq} noValidate className={`${card} grid gap-4 p-5`}>
              <FormField label="Câu hỏi" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} error={err.question} />
              <FormField as="textarea" rows={3} label="Câu trả lời" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} error={err.answer} />
              <div><button className={btnPrimary}>Thêm câu hỏi</button></div>
            </form>
            <DataTable rows={faqs.items} columns={[
              { header: 'Câu hỏi', cell: (f) => <div><p className="font-medium">{f.question}</p><p className="text-xs text-muted">{f.answer}</p></div> },
              { header: 'Trạng thái', cell: visibility },
              { header: '', className: 'text-right', cell: actions(faqs, 'câu hỏi') },
            ]} />
          </div>
        )}
      </div>
      {confirmUI}
    </>
  )
}
