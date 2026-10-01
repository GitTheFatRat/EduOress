import { useMemo } from 'react'
import { useCollection, useStore } from '../lib/store.js'
import { seedCourses, hydrateCourse } from '../data/courses.js'
import * as S from '../data/seeds.js'
import { getReviews } from '../data/reviews.js'

export const K = {
  courses: 'edupress.courses', lessons: 'edupress.lessons', reviews: 'edupress.reviews', enrollments: 'edupress.enrollments',
  progress: 'edupress.progress', transactions: 'edupress.transactions', providers: 'edupress.providers', discounts: 'edupress.discounts',
  promotions: 'edupress.promotions', gifts: 'edupress.gifts', notifications: 'edupress.notifications', reads: 'edupress.reads',
  tickets: 'edupress.tickets', deletions: 'edupress.deletions', posts: 'edupress.posts', faqs: 'edupress.faqs',
  contacts: 'edupress.contacts', costs: 'edupress.costs', permissions: 'edupress.permissions',
}

export const useLessons = () => useCollection(K.lessons, S.seedLessons)
export const useReviewsStore = () => useCollection(K.reviews, [])
export const useEnrollments = () => useCollection(K.enrollments, S.seedEnrollments)
export const useProgress = () => useCollection(K.progress, S.seedProgress)
export const useTransactions = () => useCollection(K.transactions, S.seedTransactions)
export const useProviders = () => useCollection(K.providers, S.seedProviders)
export const useDiscounts = () => useCollection(K.discounts, S.seedDiscounts)
export const usePromotions = () => useCollection(K.promotions, S.seedPromotions)
export const useGifts = () => useCollection(K.gifts, S.seedGifts)
export const useTickets = () => useCollection(K.tickets, S.seedTickets)
export const useDeletions = () => useCollection(K.deletions, [])
export const usePosts = () => useCollection(K.posts, S.seedPosts)
export const useFaqs = () => useCollection(K.faqs, S.seedFaqs)
export const useContacts = () => useCollection(K.contacts, [])
export const useCosts = () => useCollection(K.costs, S.seedCosts)
export const usePermissions = () => useStore(K.permissions, S.seedPermissions)

export function useCourses() {
  const c = useCollection(K.courses, seedCourses)
  const { items: lessons } = useLessons()
  const { items: reviews } = useReviewsStore()
  const courses = useMemo(() => c.items.map((r) => hydrateCourse(r, lessons, reviews)), [c.items, lessons, reviews])
  const published = useMemo(() => courses.filter((x) => x.status === 'PUBLISHED'), [courses])
  return { courses, published, raw: c.items, add: c.add, update: c.update, remove: c.remove }
}

export function useNotifications() {
  const n = useCollection(K.notifications, S.seedNotifications)
  const notify = (audience, title, body, type = 'SYSTEM') => n.add({ audience, title, body, type })
  return { ...n, notify }
}

export function useNotificationsFor(user) {
  const n = useNotifications()
  const [reads, setReads] = useStore(K.reads, [])
  const mine = useMemo(
    () => (user ? n.items.filter((x) => x.audience === 'ALL' || x.audience === user.role || x.audience === user.id) : [])
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [n.items, user])
  const isRead = (id) => reads.includes(`${user?.id}:${id}`)
  const markRead = (id) => !isRead(id) && setReads((r) => [...r, `${user.id}:${id}`])
  const markAll = () => setReads((r) => [...new Set([...r, ...mine.map((x) => `${user.id}:${x.id}`)])])
  return { mine, isRead, markRead, markAll, unread: mine.filter((x) => !isRead(x.id)).length }
}

export function useCourseReviews(course) {
  const { items } = useReviewsStore()
  return useMemo(() => {
    if (!course) return []
    const mine = items.filter((r) => r.courseId === course.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return [...mine, ...(course.seeded ? getReviews(course.id) : [])]
  }, [items, course])
}

export function useIsEnrolled(user, course) {
  const { items } = useEnrollments()
  return Boolean(user && course && items.some((e) => e.userId === user.id && e.courseId === course.id))
}
