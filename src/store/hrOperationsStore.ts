import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedEmployees } from '@/data/employees'

export type AttendanceStatus = 'present' | 'shortage' | 'absent' | 'leave' | 'missing-punch' | 'scheduled'

export interface AttendanceEntry {
  id: string
  employeeId: string
  date: string
  status: AttendanceStatus
  shift: string
  checkIn?: string
  checkOut?: string
  shortageMinutes: number
}

export interface LeaveBalance {
  entitled: number
  used: number
  sold: number
  donated: number
  received: number
}

export interface EmployeeDocument {
  id: string
  employeeId: string
  category: string
  name: string
  type: string
  size: number
  uploadedAt: string
}

type LeaveEffect = 'annual' | 'sale' | 'donation'

const defaultBalance: LeaveBalance = {
  entitled: 30,
  used: 8,
  sold: 0,
  donated: 0,
  received: 0,
}

const isoDate = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

function seedAttendance(): AttendanceEntry[] {
  const entries: AttendanceEntry[] = []
  const people = seedEmployees.filter(employee => employee.status === 'active')

  people.forEach((employee, personIndex) => {
    for (let offset = -21; offset < 35; offset += 1) {
      const date = new Date()
      date.setDate(date.getDate() - offset)
      if (date.getDay() === 5 || date.getDay() === 6) continue

      if (offset < 0) {
        entries.push({
          id: `${employee.id}-${isoDate(date)}`,
          employeeId: employee.id,
          date: isoDate(date),
          status: 'scheduled',
          shift: '08:00 - 16:00',
          shortageMinutes: 0,
        })
        continue
      }

      const marker = (offset + personIndex * 3) % 17
      const status: AttendanceStatus =
        marker === 2 ? 'absent'
          : marker === 5 ? 'missing-punch'
            : marker === 8 ? 'shortage'
              : marker === 11 ? 'leave'
                : 'present'

      entries.push({
        id: `${employee.id}-${isoDate(date)}`,
        employeeId: employee.id,
        date: isoDate(date),
        status,
        shift: '08:00 - 16:00',
        checkIn: status === 'absent' || status === 'leave' ? undefined : status === 'shortage' ? '08:42' : '07:58',
        checkOut: status === 'missing-punch' || status === 'absent' || status === 'leave' ? undefined : '16:02',
        shortageMinutes: status === 'shortage' ? 42 : 0,
      })
    }
  })

  return entries
}

interface HrOperationsState {
  balances: Record<string, LeaveBalance>
  attendance: AttendanceEntry[]
  documents: Record<string, EmployeeDocument[]>
  appliedLeaveRequestIds: string[]
  updateBalance: (employeeId: string, update: (balance: LeaveBalance) => LeaveBalance) => void
  recordAnnualLeave: (employeeId: string, days: number) => void
  recordLeaveSale: (employeeId: string, days: number) => void
  transferLeave: (fromId: string, toId: string, days: number) => void
  applyApprovedLeave: (requestId: string, employeeId: string, effect: LeaveEffect, days: number, recipientId?: string) => void
  addDocument: (document: EmployeeDocument) => void
  removeDocument: (employeeId: string, documentId: string) => void
}

export const useHrOperationsStore = create<HrOperationsState>()(
  persist(
    (set, get) => ({
      balances: {},
      attendance: seedAttendance(),
      documents: {},
      appliedLeaveRequestIds: [],

      updateBalance: (employeeId, update) => {
        const current = get().balances[employeeId] ?? defaultBalance
        set(state => ({
          balances: { ...state.balances, [employeeId]: update(current) },
        }))
      },

      recordAnnualLeave: (employeeId, days) =>
        get().updateBalance(employeeId, balance => ({
          ...balance,
          used: balance.used + Math.max(0, days),
        })),

      recordLeaveSale: (employeeId, days) =>
        get().updateBalance(employeeId, balance => ({
          ...balance,
          sold: balance.sold + Math.max(0, days),
        })),

      transferLeave: (fromId, toId, days) => {
        if (!toId || fromId === toId || days <= 0) return
        get().updateBalance(fromId, balance => ({ ...balance, donated: balance.donated + days }))
        get().updateBalance(toId, balance => ({ ...balance, received: balance.received + days }))
      },

      applyApprovedLeave: (requestId, employeeId, effect, days, recipientId) => {
        const state = get()
        const count = Math.max(0, days)
        if (
          state.appliedLeaveRequestIds.includes(requestId) ||
          !requestId ||
          !employeeId ||
          count === 0 ||
          (effect === 'donation' && (!recipientId || recipientId === employeeId))
        ) return

        set(current => {
          if (current.appliedLeaveRequestIds.includes(requestId)) return current
          const balances = { ...current.balances }
          const source = { ...(balances[employeeId] ?? defaultBalance) }

          if (effect === 'annual') source.used += count
          if (effect === 'sale') source.sold += count
          if (effect === 'donation') source.donated += count
          balances[employeeId] = source

          if (effect === 'donation' && recipientId) {
            const recipient = { ...(balances[recipientId] ?? defaultBalance) }
            recipient.received += count
            balances[recipientId] = recipient
          }

          return {
            balances,
            appliedLeaveRequestIds: [...current.appliedLeaveRequestIds, requestId],
          }
        })
      },

      addDocument: document =>
        set(state => ({
          documents: {
            ...state.documents,
            [document.employeeId]: [...(state.documents[document.employeeId] ?? []), document],
          },
        })),

      removeDocument: (employeeId, documentId) =>
        set(state => ({
          documents: {
            ...state.documents,
            [employeeId]: (state.documents[employeeId] ?? []).filter(document => document.id !== documentId),
          },
        })),
    }),
    { name: 'hr-operations', version: 1 },
  ),
)

export const getDefaultLeaveBalance = () => ({ ...defaultBalance })
