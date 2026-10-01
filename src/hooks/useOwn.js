import { useAuth } from './useAuth.js'
import { useCourses } from './useData.js'

export function useOwn() {
  const { user } = useAuth()
  const cs = useCourses()
  const mine = cs.courses.filter((c) => c.ownerId === user.id)
  return { user, ...cs, mine }
}
