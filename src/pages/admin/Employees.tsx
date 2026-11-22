import { useMemo, useState } from 'react'
import {
  MagnifyingGlass, Plus, PencilSimple, Trash, X, FloppyDisk,
  WarningCircle, ArrowCounterClockwise,
} from '@phosphor-icons/react'
import { useEmployeesStore } from '@/store/employeesStore'
import type { NewEmployee } from '@/store/employeesStore'
import { useOrganizationStore } from '@/store/organizationStore'
import type { UserRole } from '@/types'
import { formatDate } from '@/lib/format'

const gradients = [
  'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600',
]

const roleLabel: Record<UserRole, string> = {
  employee: 'موظف',
  manager: 'مدير',
  admin: 'موارد بشرية',
}

const LOCATIONS = ['الرياض - المقر الرئيسي', 'جدة - فرع الغربية', 'الدمام - فرع الشرقية']

/* ─────────────────────────── modal ─────────────────────────── */

function Modal({
  open, title, onClose, children, footer,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div onClick={onClose} className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] shadow-2xl my-auto animate-fade-up" style={{ background: 'var(--popover)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-black text-white">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 transition-all" aria-label="إغلاق">
            <X size={15} weight="bold" />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">{children}</div>
        <div className="flex items-center gap-2 px-5 py-4 border-t border-white/[0.06]">{footer}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-black text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

/* ─────────────────────────── employee editor ─────────────────────────── */

interface EmployeeForm {
  name: string
  email: string
  employeeNumber: string
  department: string
  position: string
  location: string
  nationality: string
  hireDate: string
  monthlySalary: number
  managerId: string
  role: UserRole
  status: 'active' | 'inactive'
}

const emptyForm = (): EmployeeForm => ({
  name: '',
  email: '',
  employeeNumber: '',
  department: '',
  position: '',
  location: LOCATIONS[0],
  nationality: 'سعودي',
  hireDate: new Date().toISOString().slice(0, 10),
  monthlySalary: 0,
  managerId: '',
  role: 'employee',
  status: 'active',
})

function EmployeeEditor({
  open, initial, managers, existingEmails, onClose, onSubmit,
}: {
  open: boolean
  initial: { id: string; form: EmployeeForm } | null
  managers: { id: string; name: string }[]
  existingEmails: string[]
  onClose: () => void
  onSubmit: (form: EmployeeForm) => void
}) {
  const departments = useOrganizationStore(state => state.departments)
  const positions = useOrganizationStore(state => state.positions)
  const [form, setForm] = useState<EmployeeForm>(initial?.form ?? emptyForm())
  const [error, setError] = useState('')

  const set = <K extends keyof EmployeeForm>(key: K, value: EmployeeForm[K]) => setForm(f => ({ ...f, [key]: value }))

  const submit = () => {
    if (!form.name.trim()) { setError('اسم الموظف مطلوب'); return }
    const email = form.email.trim().toLowerCase()
    if (!email) { setError('البريد الإلكتروني مطلوب'); return }
    if (existingEmails.includes(email)) { setError('هذا البريد الإلكتروني مستخدم بالفعل'); return }
    if (!form.department || !departments.includes(form.department)) { setError('اختر قسماً من القائمة'); return }
    if (!form.position || !positions.includes(form.position)) { setError('اختر مسمى وظيفياً من القائمة'); return }
    if (!Number.isFinite(form.monthlySalary) || form.monthlySalary <= 0) { setError('الراتب الشهري يجب أن يكون أكبر من صفر'); return }
    onSubmit({ ...form, name: form.name.trim(), email, employeeNumber: form.employeeNumber.trim(), position: form.position.trim() })
  }

  return (
    <Modal
      open={open}
      title={initial ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
      onClose={onClose}
      footer={
        <>
          <button onClick={submit} className="btn-primary flex-1 justify-center">
            <FloppyDisk size={16} weight="duotone" /> {initial ? 'حفظ التعديلات' : 'إضافة الموظف'}
          </button>
          <button onClick={onClose} className="btn-outline justify-center">إلغاء</button>
        </>
      }
    >
      <Field label="الاسم الكامل">
        <input value={form.name} onChange={e => { set('name', e.target.value); setError('') }} className="input" placeholder="مثال: أحمد محمد علي" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="البريد الإلكتروني">
          <input value={form.email} onChange={e => { set('email', e.target.value); setError('') }} className="input" dir="ltr" placeholder="name@hr.com" />
        </Field>
        <Field label="الرقم الوظيفي">
          <input value={form.employeeNumber} onChange={e => set('employeeNumber', e.target.value)} className="input" dir="ltr" placeholder="EMP-1234" />
        </Field>
      </div>

      {error && <p className="text-[11px] text-red-400 font-semibold -mt-1">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <Field label="القسم">
          <select value={form.department} onChange={e => set('department', e.target.value)} className="input">
            <option value="">اختر القسم...</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="المسمى الوظيفي">
          <select value={form.position} onChange={e => set('position', e.target.value)} className="input">
            <option value="">اختر المسمى الوظيفي...</option>
            {positions.map(position => <option key={position} value={position}>{position}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="الموقع">
          <select value={form.location} onChange={e => set('location', e.target.value)} className="input">
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="الجنسية">
          <input value={form.nationality} onChange={e => set('nationality', e.target.value)} className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="تاريخ التعيين">
          <input type="date" value={form.hireDate} onChange={e => set('hireDate', e.target.value)} className="input" />
        </Field>
        <Field label="الراتب الشهري">
          <input type="number" min="1" value={form.monthlySalary || ''} onChange={e => set('monthlySalary', Number(e.target.value))} className="input" placeholder="بالريال السعودي" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="المدير المباشر">
          <select value={form.managerId} onChange={e => set('managerId', e.target.value)} className="input">
            <option value="">— بدون مدير —</option>
            {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="الدور">
          <select value={form.role} onChange={e => set('role', e.target.value as UserRole)} className="input">
            <option value="employee">موظف</option>
            <option value="manager">مدير</option>
            <option value="admin">موارد بشرية</option>
          </select>
        </Field>
        <Field label="الحالة">
          <select value={form.status} onChange={e => set('status', e.target.value as 'active' | 'inactive')} className="input">
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </Field>
      </div>
    </Modal>
  )
}

/* ─────────────────────────── confirm dialog ─────────────────────────── */

function Confirm({
  open, title, message, confirmLabel, onClose, onConfirm,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button onClick={() => { onConfirm(); onClose() }}
            className="flex-1 justify-center flex items-center gap-2 font-black px-5 py-2.5 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition-colors">
            <Trash size={15} weight="bold" /> {confirmLabel}
          </button>
          <button onClick={onClose} className="btn-outline justify-center">إلغاء</button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <WarningCircle size={20} weight="duotone" className="text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-white/60 leading-relaxed">{message}</p>
      </div>
    </Modal>
  )
}

/* ─────────────────────────── page ─────────────────────────── */

export default function Employees() {
  const { employees, addEmployee, updateEmployee, removeEmployee, toggleStatus, reset } = useEmployeesStore()
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<{ open: boolean; target: string | null } | null>(null)
  const [confirm, setConfirm] = useState<{ title: string; message: string; label: string; run: () => void } | null>(null)

  const filtered = useMemo(
    () => {
      const term = search.trim().toLowerCase()
      if (!term) return employees
      return employees.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.department.toLowerCase().includes(term) ||
        e.employeeNumber.toLowerCase().includes(term),
      )
    },
    [search, employees],
  )

  const managers = useMemo(
    () => employees.filter(e => e.role === 'manager' || e.role === 'admin').map(e => ({ id: e.id, name: e.name })),
    [employees],
  )

  const targetEmployee = editor?.target ? employees.find(e => e.id === editor.target) ?? null : null

  const initial = targetEmployee
    ? {
        id: targetEmployee.id,
        form: {
          name: targetEmployee.name,
          email: targetEmployee.email,
          employeeNumber: targetEmployee.employeeNumber,
          department: targetEmployee.department,
          position: targetEmployee.position,
          location: targetEmployee.location,
          nationality: targetEmployee.nationality,
          hireDate: targetEmployee.hireDate,
          monthlySalary: targetEmployee.monthlySalary ?? 0,
          managerId: targetEmployee.managerId ?? '',
          role: targetEmployee.role,
          status: targetEmployee.status,
        } as EmployeeForm,
      }
    : null

  const submitEmployee = (form: EmployeeForm) => {
    const payload: NewEmployee = {
      name: form.name,
      email: form.email,
      employeeNumber: form.employeeNumber || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: form.department,
      position: form.position,
      location: form.location,
      nationality: form.nationality,
      hireDate: form.hireDate,
      monthlySalary: form.monthlySalary,
      managerId: form.managerId || null,
      role: form.role,
      status: form.status,
    }
    if (editor?.target) updateEmployee(editor.target, payload)
    else addEmployee(payload)
    setEditor(null)
  }

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Top */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex items-center gap-2 glass border border-white/[0.08] rounded-xl px-4 py-2.5">
          <MagnifyingGlass size={15} weight="regular" className="text-white/30 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الرقم الوظيفي أو القسم..."
            className="flex-1 bg-transparent text-sm text-white/60 placeholder-white/20 outline-none" />
        </div>
        <button
          onClick={() => setConfirm({
            title: 'استعادة قائمة الموظفين الافتراضية',
            message: 'سيتم إرجاع كل الموظفين إلى القائمة الأصلية. أي إضافات أو تعديلات ستُفقد.',
            label: 'استعادة الافتراضي',
            run: reset,
          })}
          className="btn-outline text-sm flex-shrink-0"
        >
          <ArrowCounterClockwise size={14} weight="bold" /> استعادة
        </button>
        <button onClick={() => setEditor({ open: true, target: null })} className="btn-primary text-sm flex-shrink-0">
          <Plus size={15} weight="bold" /> إضافة موظف
        </button>
      </div>

      <p className="text-xs text-white/30 font-semibold">
        <span className="text-violet-400 font-black">{filtered.length}</span> موظف
        {' '}· <span className="text-white/50">{employees.filter(e => e.status === 'active').length}</span> نشط
      </p>

      {/* Table */}
      <div className="glass border-gradient overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['الموظف', 'الرقم الوظيفي', 'القسم', 'تاريخ التعيين', 'الدور', 'الحالة', ''].map((h, i) => (
                  <th key={i} className="text-right px-5 py-3.5 text-xs font-black text-white/25 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-14 text-white/20 font-semibold">لا توجد نتائج</td></tr>
              ) : filtered.map((emp, i) => (
                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center font-black text-[#fff] text-sm shadow-lg`}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white/80">{emp.name}</p>
                        <p className="text-xs text-white/30">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/45 font-mono text-xs">{emp.employeeNumber}</td>
                  <td className="px-5 py-4 text-white/45 font-medium">
                    <p>{emp.department}</p>
                    <p className="text-[10px] text-white/25">{emp.position}</p>
                  </td>
                  <td className="px-5 py-4 text-white/30 text-xs whitespace-nowrap">{formatDate(emp.hireDate)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                      emp.role === 'admin'
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                        : emp.role === 'manager'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                    }`}>
                      {roleLabel[emp.role]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStatus(emp.id)}
                      title={emp.status === 'active' ? 'اضغط للتعطيل' : 'اضغط للتفعيل'}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border transition-colors ${
                        emp.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-white/[0.05] text-white/25 border-white/[0.08] hover:bg-white/[0.1]'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      {emp.status === 'active' ? 'نشط' : 'غير نشط'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditor({ open: true, target: emp.id })}
                        className="w-8 h-8 rounded-xl bg-white/[0.03] hover:bg-violet-500/15 flex items-center justify-center text-white/25 hover:text-violet-300 transition-all"
                        aria-label="تعديل"
                      >
                        <PencilSimple size={14} weight="bold" />
                      </button>
                      <button
                        onClick={() => setConfirm({
                          title: 'حذف الموظف',
                          message: `سيتم حذف «${emp.name}» من قائمة الموظفين. الطلبات المقدّمة سابقاً لن تتأثر.`,
                          label: 'حذف الموظف',
                          run: () => removeEmployee(emp.id),
                        })}
                        className="w-8 h-8 rounded-xl bg-white/[0.03] hover:bg-red-500/15 flex items-center justify-center text-white/25 hover:text-red-400 transition-all"
                        aria-label="حذف"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editors & confirms */}
      {editor?.open && (
        <EmployeeEditor
          key={editor.target ?? 'new'}
          open
          initial={initial}
          managers={managers}
          existingEmails={employees.filter(e => e.id !== editor.target).map(e => e.email.toLowerCase())}
          onClose={() => setEditor(null)}
          onSubmit={submitEmployee}
        />
      )}

      <Confirm
        open={!!confirm}
        title={confirm?.title ?? ''}
        message={confirm?.message ?? ''}
        confirmLabel={confirm?.label ?? 'تأكيد'}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm?.run()}
      />
    </div>
  )
}
