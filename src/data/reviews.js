const pool = [
  { id: 1, name: 'Nguyễn Thu Hà', date: '03/10/2025', rating: 5, text: 'Nội dung rõ ràng, bài giảng ngắn nên dễ theo dõi. Phần thực hành giúp mình làm được sản phẩm đầu tiên.' },
  { id: 2, name: 'Trần Quốc Bảo', date: '28/09/2025', rating: 4, text: 'Khóa học hữu ích, tuy nhiên vài bài cuối hơi nhanh. Mong nhà cung cấp bổ sung thêm bài tập.' },
  { id: 3, name: 'Lê Phương Linh', date: '21/09/2025', rating: 5, text: 'Mình đọc đánh giá trước khi mua và thấy đúng như mô tả. Tài liệu đi kèm rất đầy đủ.' },
  { id: 4, name: 'Phạm Đức Minh', date: '15/09/2025', rating: 3, text: 'Nội dung ổn nhưng âm thanh một số video còn nhỏ. Hy vọng được cải thiện.' },
  { id: 5, name: 'Võ Ngọc Anh', date: '09/09/2025', rating: 5, text: 'Giảng viên giải thích dễ hiểu, có ví dụ thực tế. Mình sẽ học tiếp khóa nâng cao.' },
  { id: 6, name: 'Đặng Hoài Nam', date: '30/08/2025', rating: 4, text: 'Lộ trình hợp lý cho người mới. Mình hoàn thành khóa trong khoảng hai tuần.' },
  { id: 7, name: 'Bùi Khánh Vy', date: '22/08/2025', rating: 5, text: 'Giá hợp lý so với nội dung. Xem lại video lúc nào cũng được nên rất tiện.' },
  { id: 8, name: 'Hoàng Gia Huy', date: '14/08/2025', rating: 4, text: 'Phần dự án cuối khóa giúp mình áp dụng được toàn bộ kiến thức đã học.' },
]

export function getReviews(courseId) {
  return Array.from({ length: 7 }, (_, i) => ({ ...pool[(i + courseId) % pool.length], id: `${courseId}-${i}` }))
}

export function summarize(list) {
  const total = list.length
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  list.forEach((r) => { dist[r.rating] += 1 })
  const avg = total ? list.reduce((n, r) => n + r.rating, 0) / total : 0
  const pct = Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, total ? Math.round((v / total) * 100) : 0]))
  return { avg, total, dist, pct }
}
