import type { RequestRecord } from '@/types'

/** Gregorian Arabic date, e.g. «20 نوفمبر 2026» */
export function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/** «20 نوفمبر 2026 - 03:40 م» */
export function formatDateTime(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Next sequential request reference, e.g. REQ-2026-0013 */
export function nextRequestId(requests: RequestRecord[]): string {
  const prefix = `REQ-${new Date().getFullYear()}-`
  const max = requests
    .filter(r => r.id.startsWith(prefix))
    .reduce((m, r) => Math.max(m, Number(r.id.slice(prefix.length)) || 0), 0)
  return `${prefix}${String(max + 1).padStart(4, '0')}`
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function todayISO(): string {
  return toISODate(new Date())
}

/** Days between two ISO timestamps (rounded down) */
export function daysBetween(from: string, to: string): number {
  const a = new Date(from).getTime()
  const b = new Date(to).getTime()
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.max(0, Math.round((b - a) / 86_400_000))
}
