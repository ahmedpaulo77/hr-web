import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarBlank, Coins, Gift, PencilSimple, Plus, Umbrella, X } from '@phosphor-icons/react'
import Badge from '@/components/ui/Badge'
import { getRequestType } from '@/data/requestTypes'
import { useAuthStore } from '@/store/authStore'
import { getEmployeeByEmail } from '@/data/employees'
import { useRequestsStore } from '@/store/requestsStore'
import { getDefaultLeaveBalance, useHrOperationsStore } from '@/store/hrOperationsStore'
import { useAvailableRequestTypes } from '@/store/requestTypesStore'
import type { RequestRecord } from '@/types'

const LEAVE_IDS = new Set([
  'leave-annual', 'leave-bereavement', 'leave-exam', 'leave-hajj',
  'leave-marriage', 'leave-sale', 'leave-donation',
])

const tabs = [
  { id: 'balance', label: 'رصيد الإجازة', icon: Umbrella },
  { id: 'requests', label: 'حالات الإجازات', icon: CalendarBlank },
] as const

type TabId = (typeof tabs)[number]['id']

const valueOf = (request: RequestRecord, key: string) => String(request.values[key] ?? '')

export default function LeaveCenter() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { requests, cancel, updateRequest } = useRequestsStore()
  const savedBalance = useHrOperationsStore(state => state.balances[user?.id ?? ''])
  const balance = savedBalance ?? getDefaultLeaveBalance()
  const available = Math.max(0, balance.entitled - balance.used - balance.sold - balance.donated + balance.received)
  const availableTypes = useAvailableRequestTypes()
  const [tab, setTab] = useState<TabId>('balance')
  const [editing, setEditing] = useState<RequestRecord | null>(null)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [editError, setEditError] = useState('')

  const myLeaves = useMemo(
    () => requests
      .filter(request => request.employeeId === user?.id && LEAVE_IDS.has(request.typeId))
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [requests, user?.id],
  )
  const leaveTypes = availableTypes.filter(type => LEAVE_IDS.has(type.id))

  const startEdit = (request: RequestRecord) => {
    setEditing(request)
    const type = getRequestType(request.typeId)
    setEditValues(Object.fromEntries(
      (type?.fields ?? []).map(field => [field.id, valueOf(request, field.id)]),
    ))
    setEditError('')
  }

  const saveEdit = () => {
    if (!editing || !user) return
    const type = getRequestType(editing.typeId)
    if (!type) return

    for (const field of type.fields) {
      const value = (editValues[field.id] ?? '').trim()
      if (field.required && !value) {
        setEditError(`حقل «${field.label}» مطلوب.`)
        return
      }
      if (field.type === 'number' && value) {
        const number = Number(value)
        if (!Number.isFinite(number) || (field.min != null && number < field.min) || (field.max != null && number > field.max)) {
          setEditError(`راجع قيمة «${field.label}» والحدود المسموحة.`)
          return
        }
      }
    }

    const start = editValues.start_date
    const end = editValues.end_date
    if (start && end && end < start) {
      setEditError('تاريخ النهاية يجب أن يكون بعد البداية.')
      return
    }

    const days = Number(editValues.days_count) || 0
    if (['leave-annual', 'leave-sale', 'leave-donation'].includes(editing.typeId) && days > available) {
      setEditError(`المتاح في رصيدك ${available} يوم فقط.`)
      return
    }
    if (editing.typeId === 'leave-donation') {
      const recipient = getEmployeeByEmail(editValues.recipient_id?.trim().toLowerCase())
      if (!recipient || recipient.status !== 'active' || recipient.role !== 'employee' || recipient.id === editing.employeeId) {
        setEditError('اختر البريد الإلكتروني لموظف نشط آخر.')
        return
      }
    }

    updateRequest(editing.id, { ...editing.values, ...editValues }, { name: user.name, role: 'موظف' })
    setEditing(null)
    setEditError('')
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">الإجازات ورصيدك</h2>
          <p className="text-sm text-white/35 mt-1">قدّم طلبك وتابع حالته ورصيد الإجازة المتاح.</p>
        </div>
        <button
          onClick={() => navigate('/app/employee/requests/new/leave-annual')}
          className="btn-primary"
        >
          <Plus size={16} weight="bold" /> طلب إجازة
        </button>
      </div>

      <div className="flex gap-2 border-b border-white/[0.08]">
        {tabs.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === item.id ? 'border-violet-400 text-violet-300' : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <Icon size={17} weight="duotone" /> {item.label}
              {item.id === 'requests' && <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px]">{myLeaves.length}</span>}
            </button>
          )
        })}
      </div>

      {tab === 'balance' ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'الرصيد السنوي', value: balance.entitled, hint: 'يوم مستحق', color: 'text-violet-300' },
              { label: 'المستخدم', value: balance.used, hint: 'يوم', color: 'text-amber-300' },
              { label: 'المباع أو المتبرع به', value: balance.sold + balance.donated, hint: 'يوم', color: 'text-rose-300' },
              { label: 'الرصيد المتاح', value: available, hint: 'يوم', color: 'text-emerald-300' },
            ].map(card => (
              <div key={card.label} className="glass border-gradient p-5">
                <p className="text-xs font-bold text-white/40">{card.label}</p>
                <p className={`mt-3 text-3xl font-black ${card.color}`}>{card.value}</p>
                <p className="mt-1 text-xs text-white/25">{card.hint}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leaveTypes.map(type => {
              const Icon = type.id === 'leave-sale' ? Coins : type.id === 'leave-donation' ? Gift : CalendarBlank
              return (
                <button
                  key={type.id}
                  onClick={() => navigate(`/app/employee/requests/new/${type.id}`)}
                  className="glass border-gradient group flex items-start gap-4 p-5 text-right transition-all hover:-translate-y-0.5 hover:border-violet-400/30"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                    <Icon size={22} weight="duotone" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-black text-white/85">{type.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/35">{type.description}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.05] p-4 text-xs leading-relaxed text-white/45">
            الرصيد الظاهر بيانات تجريبية قابلة للتخصيص. طلبات البيع والتبرع لا تخصم الأيام إلا بعد موافقة المدير.
          </div>
        </div>
      ) : (
        <div className="glass border-gradient overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.07] text-right text-xs text-white/35">
                  <th className="px-5 py-4">نوع الطلب</th>
                  <th className="px-5 py-4">الفترة</th>
                  <th className="px-5 py-4">الأيام</th>
                  <th className="px-5 py-4">الحالة</th>
                  <th className="px-5 py-4">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {myLeaves.length ? myLeaves.map(request => (
                  <tr key={request.id}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-white/75">{request.typeTitle}</p>
                      <p className="mt-1 font-mono text-[10px] text-white/25">{request.id}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-white/45">
                      {valueOf(request, 'start_date') || '—'} {valueOf(request, 'end_date') ? `إلى ${valueOf(request, 'end_date')}` : ''}
                    </td>
                    <td className="px-5 py-4 text-white/55">{valueOf(request, 'days_count') || '—'}</td>
                    <td className="px-5 py-4"><Badge status={request.status} /></td>
                    <td className="px-5 py-4">
                      {request.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(request)} className="btn-outline px-3 py-2 text-xs">
                            <PencilSimple size={13} /> تعديل
                          </button>
                          {cancelTarget === request.id ? (
                            <span className="flex items-center gap-1">
                              <button onClick={() => { cancel(request.id, { name: user?.name ?? '', role: 'موظف' }); setCancelTarget(null) }}
                                className="rounded-lg bg-rose-500/15 px-2 py-1.5 text-xs font-bold text-rose-300">تأكيد السحب</button>
                              <button onClick={() => setCancelTarget(null)} aria-label="إلغاء" className="p-1 text-white/40"><X size={14} /></button>
                            </span>
                          ) : (
                            <button onClick={() => setCancelTarget(request.id)} className="px-2 py-2 text-xs font-bold text-rose-300/80 hover:text-rose-200">
                              سحب
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-5 py-14 text-center text-sm text-white/35">لسه ماقدمتش طلب إجازة.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && getRequestType(editing.typeId) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="glass w-full max-w-lg space-y-4 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-white">تعديل طلب الإجازة</h3>
                <p className="mt-1 text-xs text-white/35">{editing.typeTitle} · {editing.id}</p>
              </div>
              <button onClick={() => setEditing(null)} aria-label="إغلاق" className="text-white/45 hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {getRequestType(editing.typeId)!.fields
                .filter(field => !field.hidden && field.type !== 'file' && field.type !== 'checkbox')
                .map(field => {
                  const wide = field.type === 'textarea'
                  const value = editValues[field.id] ?? ''
                  return (
                    <label key={field.id} className={`text-xs font-bold text-white/45 ${wide ? 'sm:col-span-2' : ''}`}>
                      {field.label}{field.required && <span className="mr-1 text-rose-400">*</span>}
                      {field.type === 'select' ? (
                        <select value={value} onChange={e => setEditValues(v => ({ ...v, [field.id]: e.target.value }))} className="input mt-2">
                          <option value="">اختر...</option>
                          {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea rows={3} value={value} placeholder={field.placeholder}
                          onChange={e => setEditValues(v => ({ ...v, [field.id]: e.target.value }))}
                          className="input mt-2 resize-none" />
                      ) : (
                        <input type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                          min={field.min} max={field.max} value={value} placeholder={field.placeholder}
                          onChange={e => setEditValues(v => ({ ...v, [field.id]: e.target.value }))}
                          className="input mt-2" />
                      )}
                    </label>
                  )
                })}
            </div>
            {editError && <p role="alert" className="text-xs font-semibold text-rose-300">{editError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="btn-outline">رجوع</button>
              <button onClick={saveEdit} className="btn-primary">حفظ التعديل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
