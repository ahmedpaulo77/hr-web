import type { RequestRecord, RequestStatus } from '@/types'
import { getEmployees } from '@/data/employees'

/** Newest first */
export const sortByNewest = (list: RequestRecord[]) =>
  [...list].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))

export const requestsForEmployee = (requests: RequestRecord[], employeeId?: string | null) =>
  sortByNewest(requests.filter(r => r.employeeId === employeeId))

/** Requests of everyone reporting to the manager + the manager's own requests */
export const requestsForManager = (requests: RequestRecord[], managerId?: string | null) => {
  if (!managerId) return []
  const teamIds = new Set(
    getEmployees().filter(e => e.managerId === managerId).map(e => e.id)
  )
  teamIds.add(managerId)
  return sortByNewest(requests.filter(r => teamIds.has(r.employeeId)))
}

export const countByStatus = (list: RequestRecord[]) => {
  const counts: Record<RequestStatus, number> = {
    pending: 0, processing: 0, approved: 0, rejected: 0, cancelled: 0,
  }
  for (const r of list) counts[r.status]++
  return counts
}

export const isThisMonth = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

/** Last `count` months → { label, total, approved } */
export function monthlySeries(list: RequestRecord[], count = 6) {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1)
    const inMonth = list.filter(r => {
      const rd = new Date(r.submittedAt)
      return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
    })
    return {
      label: new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(d),
      total: inMonth.length,
      approved: inMonth.filter(r => r.status === 'approved').length,
    }
  })
}

/** Distribution by request type, sorted desc */
export function typeDistribution(list: RequestRecord[], limit = 5) {
  const map = new Map<string, { label: string; count: number }>()
  for (const r of list) {
    const entry = map.get(r.typeId) ?? { label: r.typeTitle, count: 0 }
    entry.count++
    map.set(r.typeId, entry)
  }
  const total = list.length || 1
  return [...map.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(e => ({ ...e, pct: Math.round((e.count / total) * 100) }))
}

/** Average days between submission and last update for decided requests */
export function avgProcessingDays(list: RequestRecord[]) {
  const decided = list.filter(r => r.status !== 'pending' && r.status !== 'cancelled')
  if (!decided.length) return 0
  const total = decided.reduce((sum, r) => {
    const a = new Date(r.submittedAt).getTime()
    const b = new Date(r.updatedAt).getTime()
    return sum + Math.max(0, (b - a) / 86_400_000)
  }, 0)
  return Math.round((total / decided.length) * 10) / 10
}

export const approvalRate = (list: RequestRecord[]) => {
  const decided = list.filter(r => r.status === 'approved' || r.status === 'rejected')
  if (!decided.length) return 0
  return Math.round((decided.filter(r => r.status === 'approved').length / decided.length) * 100)
}
