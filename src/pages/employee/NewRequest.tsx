import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, PaperPlaneTilt, MagnifyingGlass, FileText, SpinnerGap,
  CheckCircle, Eye, Plus, ArrowCounterClockwise, UsersThree, WarningCircle,
} from '@phosphor-icons/react'
import { requestCategories, getRequestType } from '@/data/requestTypes'
import type { FormField } from '@/data/requestTypes'
import { useAuthStore } from '@/store/authStore'
import { useRequestsStore } from '@/store/requestsStore'
import { useAvailableRequestTypes } from '@/store/requestTypesStore'
import { useDependentsStore } from '@/store/dependentsStore'
import { getEmployeeByEmail } from '@/data/employees'
import { todayISO } from '@/lib/format'
import { iconForType, iconForCategory } from '@/lib/requestIcons'
import EmployeeInfoCard from '@/components/ui/EmployeeInfoCard'
import EmployeePicker from '@/components/ui/EmployeePicker'
import FileUpload from '@/components/ui/FileUpload'
import RequestCard from '@/components/ui/RequestCard'
import type { Attachment, Dependent, Employee, FieldValue, RequestRecord } from '@/types'

/* ─────────────────────────── helpers ─────────────────────────── */

const IBAN_RE = /^SA\d{22}$/i
const ID_RE = /^\d{10}$/

const normalizeIban = (value: string) => value.replace(/\s+/g, '').toUpperCase()

function initialValues(typeId: string, nationality?: string): Record<string, FieldValue> {
  const defaults: Record<string, FieldValue> = {}
  if (typeId === 'experience-certificate' && nationality) defaults.nationality = nationality
  return defaults
}

function validate(
  fields: FormField[],
  values: Record<string, FieldValue>,
  attachments: Attachment[],
  requiresAttachment: boolean,
  employeeNumber?: string,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const today = todayISO()

  for (const field of fields) {
    if (field.hidden) continue

    const raw = values[field.id]
    const text = typeof raw === 'string' ? raw.trim() : ''

    if (field.type === 'checkbox') {
      if (field.required && raw !== true) errors[field.id] = 'يجب الموافقة على هذا الإقرار'
      continue
    }

    if (field.required && !text) {
      errors[field.id] = 'هذا الحقل مطلوب'
      continue
    }

    if (!text) continue

    if (field.type === 'iban' && !IBAN_RE.test(normalizeIban(text))) {
      errors[field.id] = 'صيغة الآيبان غير صحيحة — يجب أن يبدأ بـ SA ويتبعه 22 رقماً'
    }

    if (field.id === 'id_number' && !ID_RE.test(text)) {
      errors[field.id] = 'رقم الهوية يجب أن يكون 10 أرقام'
    }

    if (field.type === 'number') {
      const n = Number(text)
      if (Number.isNaN(n)) errors[field.id] = 'أدخل رقماً صحيحاً'
      else if (field.min != null && n < field.min) errors[field.id] = `أقل قيمة مسموحة ${field.min}`
      else if (field.max != null && n > field.max) errors[field.id] = `أقصى قيمة مسموحة ${field.max}`
    }
  }

  // date ordering rules: [earlier, later, message]
  const pairs: [string, string, string][] = [
    ['last_leave_start', 'last_leave_end', 'تاريخ نهاية الإجازة يجب أن يكون بعد بدايتها'],
    ['last_leave_end', 'return_date', 'تاريخ المباشرة يجب أن يكون بعد نهاية الإجازة'],
    ['contract_start', 'contract_end', 'نهاية العقد يجب أن تكون بعد بدايته'],
  ]
  for (const [before, after, message] of pairs) {
    const a = values[before]
    const b = values[after]
    if (typeof a === 'string' && typeof b === 'string' && a && b && b <= a) {
      errors[after] = message
    }
  }

  // dates that cannot be in the future / in the past
  const notFuture: [string, string][] = [
    ['return_date', 'تاريخ المباشرة لا يمكن أن يكون في المستقبل'],
    ['event_date', 'تاريخ الحدث لا يمكن أن يكون في المستقبل'],
    ['birth_date', 'تاريخ الميلاد لا يمكن أن يكون في المستقبل'],
  ]
  for (const [key, message] of notFuture) {
    const value = values[key]
    if (typeof value === 'string' && value && value > today) errors[key] = message
  }

  const notPast: [string, string][] = [
    ['travel_date', 'تاريخ السفر يجب أن يكون اليوم أو بعده'],
    ['last_day', 'آخر يوم عمل لا يمكن أن يكون في الماضي'],
  ]
  for (const [key, message] of notPast) {
    const value = values[key]
    if (typeof value === 'string' && value && value < today) errors[key] = message
  }

  if (requiresAttachment && attachments.length === 0) {
    errors.__attachments = 'هذا النوع من الطلبات يتطلب مرفقاً واحداً على الأقل'
  }

  // the guarantor cannot be the employee himself
  const guarantor = values.guarantor_number
  if (typeof guarantor === 'string' && employeeNumber &&
      guarantor.trim().toUpperCase() === employeeNumber.toUpperCase()) {
    errors.guarantor_number = 'لا يمكن أن يكون الموظف نفسه كفيلاً'
  }

  return errors
}

/* ─────────────────────────── form ─────────────────────────── */

function RequestForm({
  typeId,
  employee,
  actingFor,
}: {
  typeId: string
  employee: Employee
  actingFor: boolean
}) {
  const type = getRequestType(typeId)!
  const navigate = useNavigate()
  const { search } = useLocation()
  const { user } = useAuthStore()
  const { addRequest } = useRequestsStore()
  const dependents = useDependentsStore(s => s.byEmployee[employee.id] ?? [])

  const [values, setValues] = useState<Record<string, FieldValue>>(
    () => initialValues(typeId, employee.nationality),
  )
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<RequestRecord | null>(null)

  const basePath = user?.role === 'manager' ? '/app/manager' : user?.role === 'admin' ? '/app/admin' : '/app/employee'
  const backTo = `${basePath}/requests/new${search}`

  const setValue = (id: string, value: FieldValue) => {
    setValues(prev => {
      const next = { ...prev, [id]: value }

      // auto-calc monthly deduction for loans
      if (typeId === 'loan' && (id === 'amount' || id === 'installments')) {
        const amount = Number(next.amount)
        const installments = Number(next.installments)
        if (amount > 0 && installments > 0) {
          next.monthly_deduction = String(Math.ceil(amount / installments))
        }
      }
      return next
    })
    setErrors(prev => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const selectDependent = (dependent: Dependent | undefined) => {
    setValues(prev => {
      const next: Record<string, FieldValue> = { ...prev }
      if (!dependent) {
        next.dependent_id = ''
        next.contact_type = ''
        next.dependent_name = ''
        next.gender = ''
        next.birth_date = ''
        next.id_number = ''
        return next
      }
      next.dependent_id = dependent.id
      next.contact_type = dependent.relation
      next.dependent_name = dependent.name
      next.gender = dependent.gender
      next.birth_date = dependent.birthDate
      next.id_number = dependent.idNumber
      return next
    })
    setErrors(prev => {
      const next = { ...prev }
      for (const key of ['dependent_id', 'contact_type', 'dependent_name', 'gender', 'birth_date', 'id_number']) {
        delete next[key]
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const found = validate(type.fields, values, attachments, type.attachments?.required ?? false, employee.employeeNumber)
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))

    const request = addRequest({
      typeId: type.id,
      typeTitle: type.title,
      employee,
      submittedBy: {
        name: user?.name ?? employee.name,
        role: user?.role === 'manager' ? 'مدير' : user?.role === 'admin' ? 'موارد بشرية' : 'موظف',
      },
      values,
      attachments,
    })

    setCreated(request)
    setLoading(false)
  }

  if (created) {
    return (
      <div className="glass border-gradient p-10 sm:p-14 text-center max-w-lg mx-auto rounded-3xl animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} weight="duotone" className="text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">تم تقديم الطلب بنجاح!</h3>
        <p className="text-white/40 text-sm mb-5">
          {actingFor
            ? `تم تقديم الطلب بالنيابة عن ${employee.name}. سيتم إشعار الموظف والمدير المختص.`
            : 'سيتم مراجعة طلبك من قبل المدير المختص.'}
        </p>

        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] px-5 py-4 mb-6">
          <p className="text-[11px] font-black text-white/30 uppercase tracking-wider mb-1">رقم الطلب</p>
          <p className="text-lg font-black font-mono text-violet-300">{created.id}</p>
          <p className="text-[11px] text-white/30 mt-2">
            الحالة: قيد الانتظار · متوسط وقت المعالجة 2–3 أيام عمل
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate(`${basePath}/requests/${created.id}`)}
            className="btn-primary flex-1 justify-center"
          >
            <Eye size={16} weight="bold" /> عرض الطلب
          </button>
          <button
            onClick={() => { setCreated(null); setValues(initialValues(typeId, employee.nationality)); setAttachments([]); setErrors({}) }}
            className="btn-outline flex-1 justify-center"
          >
            <Plus size={16} weight="bold" /> طلب آخر
          </button>
        </div>

        <button
          onClick={() => navigate(basePath === '/app/manager' ? `${basePath}/team` : `${basePath}/requests`)}
          className="text-xs text-white/30 hover:text-violet-300 font-bold mt-5 transition-colors"
        >
          {basePath === '/app/manager' ? 'العودة إلى طلبات الفريق' : 'العودة إلى طلباتي'}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-up space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(backTo)}
          className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all flex-shrink-0"
          aria-label="رجوع"
        >
          <ArrowRight size={18} weight="bold" />
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0"
            style={{ backgroundColor: type.color + '20', borderColor: type.color + '40' }}
          >
            {(() => { const Icon = iconForType(type.id); return <Icon size={22} weight="duotone" style={{ color: type.color }} /> })()}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-white truncate">{type.title}</h2>
            <p className="text-sm text-white/35 truncate">{type.description}</p>
          </div>
        </div>
      </div>

      {actingFor && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
          <UsersThree size={16} weight="duotone" className="text-amber-400 flex-shrink-0" />
          <p className="text-sm text-white/60">
            تقديم طلب بالنيابة عن <span className="font-black text-white/85">{employee.name}</span>
          </p>
        </div>
      )}

      <EmployeeInfoCard employee={employee} />

      <form onSubmit={handleSubmit} className="glass border-gradient p-6 sm:p-7 rounded-3xl space-y-5">
        <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
          {type.fields.filter(field => !field.hidden).map(field => {
            const error = errors[field.id]
            const wide = field.type === 'textarea' || field.type === 'dependent'
            const control = renderControl(field, values[field.id], setValue, dependents, selectDependent)
            return (
              <div key={field.id} className={wide ? 'sm:col-span-2' : ''}>
                {field.type !== 'checkbox' && (
                  <label htmlFor={`f-${field.id}`} className="block text-xs font-black text-white/50 uppercase tracking-wider mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 mr-1">*</span>}
                    {field.readOnly && <span className="text-white/20 font-bold normal-case tracking-normal mr-2">· تلقائي</span>}
                  </label>
                )}
                {control}
                {error
                  ? <p className="text-[11px] text-red-400 font-semibold mt-1.5">{error}</p>
                  : field.help && <p className="text-[11px] text-white/25 mt-1.5">{field.help}</p>}
              </div>
            )
          })}
        </div>

        {typeId === 'medical-insurance' && dependents.length === 0 && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
            <WarningCircle size={16} weight="fill" className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/50 leading-relaxed">
              لا يوجد تابعون مسجلون لهذا الموظف. لازم تضيف التابع أولاً من صفحة{' '}
              <button
                type="button"
                onClick={() => navigate('/app/employee/dependents')}
                className="text-amber-300 font-black hover:text-amber-200 underline underline-offset-2"
              >
                التابعون
              </button>
              {' '}قبل طلب التأمين الطبي.
            </p>
          </div>
        )}

        <FileUpload
          files={attachments}
          onChange={list => {
            setAttachments(list)
            setErrors(prev => {
              if (!prev.__attachments) return prev
              const next = { ...prev }
              delete next.__attachments
              return next
            })
          }}
          required={type.attachments?.required}
          hint={type.attachments?.hint}
          error={errors.__attachments}
        />

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 justify-center py-3.5 text-base shadow-2xl shadow-violet-900/50 disabled:opacity-50"
          >
            {loading
              ? <><SpinnerGap size={18} weight="bold" className="animate-spin-slow" /> جاري التقديم...</>
              : <><PaperPlaneTilt size={18} weight="fill" /> تقديم الطلب</>}
          </button>
          <button
            type="button"
            onClick={() => { setValues(initialValues(typeId, employee.nationality)); setAttachments([]); setErrors({}) }}
            className="btn-outline justify-center sm:w-auto"
          >
            <ArrowCounterClockwise size={15} weight="bold" /> تفريغ
          </button>
        </div>
      </form>
    </div>
  )
}

function renderControl(
  field: FormField,
  value: FieldValue | undefined,
  setValue: (id: string, value: FieldValue) => void,
  dependents: Dependent[],
  onDependentChange: (dependent: Dependent | undefined) => void,
) {
  const id = `f-${field.id}`
  const stringValue = typeof value === 'string' ? value : ''

  if (field.type === 'checkbox') {
    return (
      <label htmlFor={id} className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 cursor-pointer hover:border-violet-500/30 transition-colors">
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={e => setValue(field.id, e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-violet-500 flex-shrink-0"
        />
        <span className="text-sm font-semibold text-white/60 leading-relaxed">
          {field.label}
          {field.required && <span className="text-red-400 mr-1">*</span>}
        </span>
      </label>
    )
  }

  if (field.type === 'dependent') {
    return (
      <select
        id={id}
        value={stringValue}
        onChange={e => {
          const dep = dependents.find(d => d.id === e.target.value)
          onDependentChange(dep)
        }}
        className="input"
        disabled={dependents.length === 0}
      >
        <option value="">{dependents.length ? 'اختر التابع...' : 'لا يوجد تابعون مسجلون'}</option>
        {dependents.map(dep => (
          <option key={dep.id} value={dep.id}>
            {dep.name} — {dep.relation}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'select') {
    return (
      <select
        id={id}
        value={stringValue}
        onChange={e => setValue(field.id, e.target.value)}
        className="input"
      >
        <option value="">اختر...</option>
        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        id={id}
        rows={3}
        placeholder={field.placeholder}
        value={stringValue}
        onChange={e => setValue(field.id, e.target.value)}
        className="input resize-none"
      />
    )
  }

  if (field.type === 'iban') {
    return (
      <input
        id={id}
        type="text"
        inputMode="text"
        dir="ltr"
        maxLength={24}
        placeholder={field.placeholder ?? 'SA0000000000000000000000'}
        value={stringValue}
        onChange={e => setValue(field.id, e.target.value.toUpperCase())}
        className="input font-mono tracking-wide"
      />
    )
  }

  return (
    <input
      id={id}
      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
      inputMode={field.type === 'number' ? 'numeric' : undefined}
      min={field.min}
      max={field.max}
      maxLength={field.maxLength}
      placeholder={field.placeholder}
      value={stringValue}
      readOnly={field.readOnly}
      onChange={e => setValue(field.id, e.target.value)}
      className={`input ${field.readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
    />
  )
}

/* ─────────────────────────── type picker ─────────────────────────── */

export default function NewRequest() {
  const { type: typeId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  const availableTypes = useAvailableRequestTypes()
  const [search, setSearch] = useState('')

  const isManager = user?.role === 'manager'
  const actingForId = searchParams.get('employee')
  const actingFor = isManager ? getEmployeeByEmail(actingForId) : null
  const ownEmployee = getEmployeeByEmail(user?.id)
  const employee = isManager ? actingFor : ownEmployee

  const basePath = isManager ? '/app/manager' : user?.role === 'admin' ? '/app/admin' : '/app/employee'

  const filtered = useMemo(
    () => availableTypes.filter(r => r.title.includes(search) || r.description.includes(search)),
    [availableTypes, search],
  )

  // Managers must pick an employee before choosing a request type
  if (isManager && !actingFor) {
    return (
      <EmployeePicker
        managerId={user?.id}
        onSelect={id =>
          navigate(`/app/manager/requests/new?employee=${encodeURIComponent(id)}`)
        }
      />
    )
  }

  if (!employee) {
    return (
      <div className="glass border-gradient p-16 text-center rounded-3xl animate-fade-up max-w-lg mx-auto">
        <FileText size={40} weight="duotone" className="text-white/20 mx-auto mb-4" />
        <p className="text-lg font-black text-white mb-1">تعذّر العثور على الموظف</p>
        <p className="text-sm text-white/35 mb-5">الموظف المحدد غير موجود أو غير نشط.</p>
        <button onClick={() => navigate(`${basePath}/requests/new`)} className="btn-primary mx-auto">
          <ArrowRight size={15} weight="bold" /> رجوع
        </button>
      </div>
    )
  }

  if (typeId && getRequestType(typeId)) {
    return (
      <RequestForm
        key={`${typeId}-${employee.id}`}
        typeId={typeId}
        employee={employee}
        actingFor={isManager}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {isManager && (
        <div className="flex items-center justify-between gap-3 flex-wrap rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center font-black text-amber-300 flex-shrink-0">
              {employee.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-amber-400/80 uppercase tracking-wider">تقديم طلب بالنيابة عن</p>
              <p className="font-black text-white/85 truncate">{employee.name}</p>
              <p className="text-xs text-white/30 truncate">{employee.employeeNumber} · {employee.department}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/manager/requests/new')}
            className="text-xs font-black text-amber-300 hover:text-amber-200 px-3 py-2 rounded-xl border border-amber-500/20 hover:bg-amber-500/10 transition-colors flex-shrink-0"
          >
            تغيير الموظف
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-white">اختر نوع الطلب</h2>
          <p className="text-sm text-white/35">{availableTypes.length} نوع طلب متاح</p>
        </div>
      </div>

      <div className="flex items-center gap-3 glass border border-white/[0.08] rounded-2xl px-5 py-3.5">
        <MagnifyingGlass size={18} weight="regular" className="text-white/30 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن نوع الطلب..."
          className="flex-1 bg-transparent text-sm text-white/70 placeholder-white/25 outline-none"
        />
      </div>

      {requestCategories.map(cat => {
        const items = filtered.filter(r => r.category === cat.id)
        if (!items.length) return null
        const CatIcon = iconForCategory(cat.id)
        return (
          <div key={cat.id}>
            <h3 className="flex items-center gap-2 text-xs font-black text-white/30 uppercase tracking-widest mb-3">
              <CatIcon size={15} weight="duotone" className="text-violet-400/70" />
              {cat.label}
              <span className="text-white/15 font-bold normal-case tracking-normal">({items.length})</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map(rt => (
                <RequestCard
                  key={rt.id}
                  id={rt.id}
                  title={rt.title}
                  icon={iconForType(rt.id)}
                  color={rt.color}
                  description={rt.description}
                  basePath={basePath}
                />
              ))}
            </div>
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div className="glass border-gradient p-14 text-center rounded-3xl">
          <MagnifyingGlass size={34} weight="duotone" className="text-white/20 mx-auto mb-3" />
          <p className="font-black text-white/70">لا توجد نتائج</p>
          <p className="text-sm text-white/30 mt-1">جرّب كلمة بحث أخرى</p>
        </div>
      )}
    </div>
  )
}
