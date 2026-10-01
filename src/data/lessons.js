const sectionTitles = ['Giới thiệu khóa học', 'Kiến thức nền tảng', 'Thực hành dự án', 'Tổng kết và bước tiếp theo']
const lessonTitles = [
  'Tổng quan nội dung', 'Cài đặt công cụ', 'Khái niệm cơ bản', 'Ví dụ minh họa', 'Bài tập thực hành',
  'Chữa bài tập', 'Mẹo và lỗi thường gặp', 'Dự án nhỏ', 'Hoàn thiện sản phẩm', 'Tổng kết',
]

export function getSections(courseId) {
  return sectionTitles.map((title, s) => {
    const n = 3 + ((courseId + s) % 3)
    const lessons = Array.from({ length: n }, (_, l) => ({
      id: `${courseId}-${s + 1}-${l + 1}`,
      title: lessonTitles[(s * 3 + l) % lessonTitles.length],
      durationSec: 300 + ((courseId * 7 + s * 61 + l * 131) % 600),
      preview: s < 2 && l === 0,
    }))
    return { id: `${courseId}-s${s + 1}`, title, lessons }
  })
}

export const countLessons = (sections) => sections.reduce((n, s) => n + s.lessons.length, 0)

export const formatDuration = (sec) => {
  const m = Math.floor(sec / 60)
  const s = String(sec % 60).padStart(2, '0')
  return `${String(m).padStart(2, '0')}:${s}`
}

export const totalMinutes = (lessons) => Math.round(lessons.reduce((n, l) => n + l.durationSec, 0) / 60)

export function groupSections(lessons) {
  const map = new Map()
  lessons.forEach((l) => {
    if (!map.has(l.section)) map.set(l.section, { id: l.section, title: l.section, lessons: [] })
    map.get(l.section).lessons.push(l)
  })
  return [...map.values()]
}
