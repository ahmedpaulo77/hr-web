import { useState } from 'react'
import { requestCategories } from '@/data/requestTypes'
import type { FieldType, FormField, RequestCategory, RequestType } from '@/data/requestTypes'
import type { ApprovalRole } from '@/types'
import { useRequestTypesStore } from '@/store/requestTypesStore'
import {
  Plus, Trash, PencilSimple, DotsSixVertical, ToggleLeft, ToggleRight,
  CaretDown, CaretUp, X, FloppyDisk, ArrowCounterClockwise, WarningCircle,
  ArrowUp, ArrowDown,
} from '@phosphor-icons/react'

/* ─────────────────────────── shared bits ─────────────────────────── */

const COLOR_PALETTE = [
  '#3b6bfa', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#6366f1', '#d946ef', '#f43f5e',
]

const FIELD_TYPES: { id: FieldType; label: string }[] = [
  { id: 'text',      label: 'نص' },
  { id: 'textarea',  label: 'نص طويل' },
  { id: 'number',    label: 'رقم' },
  { id: 'date',      label: 'تاريخ' },
  { id: 'select',    label: 'قائمة اختيار' },
  { id: 'checkbox',  label: 'إقرار (موافقة)' },
  { id: 'iban',      label: 'آيبان' },
  { id: 'file',      label: 'ملف' },
  { id: 'dependent', label: 'تابع' },
]

const fieldTypeLabel = (t: FieldType) => FIELD_TYPES.find(f => f.id === t)?.label ?? t

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

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
      <div
        onClick={onClose}
        className="fixed inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] shadow-2xl my-auto animate-fade-up"
        style={{ background: 'var(--popover)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-black text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 transition-all"
            aria-label="إغلاق"
          >
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

/* ─────────────────────────── type editor ─────────────────────────── */

interface TypeForm {
  title: string
  description: string
  category: RequestCategory
  color: string
  needsAttachment: boolean
  attachmentHint: string
  approvalFlow: ApprovalRole[]
}

const approvalRoleLabel: Record<ApprovalRole, string> = {
  manager: 'المدير المباشر',
  admin: 'الموارد البشرية',
}

function TypeEditor({
  open, initial, onClose, onSubmit,
}: {
  open: boolean
  initial?: RequestType | null
  onClose: () => void
  onSubmit: (form: TypeForm) => void
}) {
  const [form, setForm] = useState<TypeForm>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    category: initial?.category ?? 'salary',
    color: initial?.color ?? COLOR_PALETTE[0],
    needsAttachment: initial?.attachments?.required ?? false,
    attachmentHint: initial?.attachments?.hint ?? '',
    approvalFlow: initial?.approvalFlow?.length ? initial.approvalFlow : ['manager'],
  })
  const [error, setError] = useState('')

  const set = <K extends keyof TypeForm>(key: K, value: TypeForm[K]) => setForm(f => ({ ...f, [key]: value }))

  const submit = () => {
    if (!form.title.trim()) { setError('اسم النوع مطلوب'); return }
    onSubmit(form)
  }

  return (
    <Modal
      open={open}
      title={initial ? 'تعديل نوع الطلب' : 'إضافة نوع طلب جديد'}
      onClose={onClose}
      footer={
        <>
          <button onClick={submit} className="btn-primary flex-1 justify-center">
            <FloppyDisk size={16} weight="duotone" /> {initial ? 'حفظ التعديلات' : 'إضافة النوع'}
          </button>
          <button onClick={onClose} className="btn-outline justify-center">إلغاء</button>
        </>
      }
    >
      <Field label="اسم النوع">
        <input value={form.title} onChange={e => { set('title', e.target.value); setError('') }} className="input" placeholder="مثال: طلب نقل كفالة" />
        {error && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{error}</p>}
      </Field>

      <Field label="الوصف">
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="input resize-none" placeholder="وصف مختصر يظهر للموظف" />
      </Field>

      <Field label="التصنيف">
        <select value={form.category} onChange={e => set('category', e.target.value as RequestCategory)} className="input">
          {requestCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>

      <Field label="اللون">
        <div className="flex flex-wrap gap-2 pt-1">
          {COLOR_PALETTE.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => set('color', color)}
              className={`w-8 h-8 rounded-xl border-2 transition-all ${form.color === color ? 'scale-110 border-white/70' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
      </Field>

      <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 cursor-pointer">
        <input type="checkbox" checked={form.needsAttachment} onChange={e => set('needsAttachment', e.target.checked)} className="w-4 h-4 accent-violet-500" />
        <span className="text-sm font-semibold text-white/60">يتطلب مرفقاً إلزامياً</span>
      </label>

      {form.needsAttachment && (
        <Field label="إرشاد المرفق">
          <input value={form.attachmentHint} onChange={e => set('attachmentHint', e.target.value)} className="input" placeholder="ما الذي يجب على الموظف رفعه؟" />
        </Field>
      )}

      <Field label="مسار الموافقات وترتيبها">
        <div className="space-y-2">
          {form.approvalFlow.map((role, index) => (
            <div key={`${role}-${index}`} className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2">
              <span className="w-7 text-center text-xs font-black text-white/35">{index + 1}</span>
              <select
                value={role}
                onChange={event => set('approvalFlow', form.approvalFlow.map((current, i) =>
                  i === index ? event.target.value as ApprovalRole : current,
                ))}
                className="input flex-1"
              >
                <option value="manager">المدير المباشر</option>
                <option value="admin">الموارد البشرية</option>
              </select>
              <button type="button" aria-label="تحريك المرحلة لأعلى" disabled={index === 0}
                onClick={() => set('approvalFlow', form.approvalFlow.map((value, i) =>
                  i === index - 1 ? role : i === index ? form.approvalFlow[index - 1] : value,
                ))}
                className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] disabled:opacity-20">
                <ArrowUp size={15} />
              </button>
              <button type="button" aria-label="تحريك المرحلة لأسفل" disabled={index === form.approvalFlow.length - 1}
                onClick={() => set('approvalFlow', form.approvalFlow.map((value, i) =>
                  i === index + 1 ? role : i === index ? form.approvalFlow[index + 1] : value,
                ))}
                className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] disabled:opacity-20">
                <ArrowDown size={15} />
              </button>
              <button type="button" aria-label="حذف مرحلة الموافقة" disabled={form.approvalFlow.length <= 1}
                onClick={() => set('approvalFlow', form.approvalFlow.filter((_, i) => i !== index))}
                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-20">
                <Trash size={14} />
              </button>
            </div>
          ))}
          {form.approvalFlow.length < 2 && (
            <button type="button" onClick={() => set('approvalFlow', [...form.approvalFlow, form.approvalFlow[0] === 'manager' ? 'admin' : 'manager'])}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-violet-300 hover:bg-violet-500/10">
              <Plus size={13} weight="bold" /> إضافة مرحلة ({approvalRoleLabel[form.approvalFlow[0] === 'manager' ? 'admin' : 'manager']})
            </button>
          )}
        </div>
      </Field>
    </Modal>
  )
}

/* ─────────────────────────── field editor ─────────────────────────── */

interface FieldForm {
  label: string
  type: FieldType
  required: boolean
  options: string
  placeholder: string
  help: string
  min: string
  max: string
  maxLength: string
}

const emptyFieldForm = (initial?: FormField | null): FieldForm => ({
  label: initial?.label ?? '',
  type: initial?.type ?? 'text',
  required: initial?.required ?? false,
  options: initial?.options?.join('\n') ?? '',
  placeholder: initial?.placeholder ?? '',
  help: initial?.help ?? '',
  min: initial?.min != null ? String(initial.min) : '',
  max: initial?.max != null ? String(initial.max) : '',
  maxLength: initial?.maxLength != null ? String(initial.maxLength) : '',
})

function FieldEditor({
  open, initial, onClose, onSubmit,
}: {
  open: boolean
  initial?: FormField | null
  onClose: () => void
  onSubmit: (field: FormField) => void
}) {
  const [form, setForm] = useState<FieldForm>(emptyFieldForm(initial))
  const [error, setError] = useState('')

  const set = <K extends keyof FieldForm>(key: K, value: FieldForm[K]) => setForm(f => ({ ...f, [key]: value }))

  const submit = () => {
    if (!form.label.trim()) { setError('اسم الحقل مطلوب'); return }
    const field: FormField = {
      id: initial?.id ?? uid('fld'),
      label: form.label.trim(),
      type: form.type,
      required: form.required,
      options: form.type === 'select'
        ? form.options.split('\n').map(o => o.trim()).filter(Boolean)
        : undefined,
      placeholder: form.placeholder.trim() || undefined,
      help: form.help.trim() || undefined,
      min: form.type === 'number' && form.min ? Number(form.min) : undefined,
      max: form.type === 'number' && form.max ? Number(form.max) : undefined,
      maxLength: form.maxLength ? Number(form.maxLength) : undefined,
    }
    onSubmit(field)
  }

  return (
    <Modal
      open={open}
      title={initial ? 'تعديل الحقل' : 'إضافة حقل جديد'}
      onClose={onClose}
      footer={
        <>
          <button onClick={submit} className="btn-primary flex-1 justify-center">
            <FloppyDisk size={16} weight="duotone" /> {initial ? 'حفظ التعديلات' : 'إضافة الحقل'}
          </button>
          <button onClick={onClose} className="btn-outline justify-center">إلغاء</button>
        </>
      }
    >
      <Field label="اسم الحقل">
        <input value={form.label} onChange={e => { set('label', e.target.value); setError('') }} className="input" placeholder="مثال: رقم الهوية" />
        {error && <p className="text-[11px] text-red-400 font-semibold mt-1.5">{error}</p>}
      </Field>

      <Field label="نوع الحقل">
        <select value={form.type} onChange={e => set('type', e.target.value as FieldType)} className="input">
          {FIELD_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </Field>

      {form.type === 'select' && (
        <Field label="الخيارات (كل خيار في سطر)">
          <textarea value={form.options} onChange={e => set('options', e.target.value)} rows={4} className="input resize-none font-mono text-xs" placeholder={'نعم\nلا'} />
        </Field>
      )}

      {form.type === 'number' && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="أقل قيمة">
            <input type="number" value={form.min} onChange={e => set('min', e.target.value)} className="input" />
          </Field>
          <Field label="أقصى قيمة">
            <input type="number" value={form.max} onChange={e => set('max', e.target.value)} className="input" />
          </Field>
        </div>
      )}

      {form.type !== 'select' && form.type !== 'checkbox' && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="نص مساعد (Placeholder)">
            <input value={form.placeholder} onChange={e => set('placeholder', e.target.value)} className="input" />
          </Field>
          <Field label="أقصى عدد أحرف">
            <input type="number" value={form.maxLength} onChange={e => set('maxLength', e.target.value)} className="input" />
          </Field>
        </div>
      )}

      <Field label="ملاحظة تحت الحقل">
        <input value={form.help} onChange={e => set('help', e.target.value)} className="input" placeholder="نص إرشادي اختياري" />
      </Field>

      <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 cursor-pointer">
        <input type="checkbox" checked={form.required} onChange={e => set('required', e.target.checked)} className="w-4 h-4 accent-violet-500" />
        <span className="text-sm font-semibold text-white/60">حقل إلزامي</span>
      </label>
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

export default function RequestTypes() {
  const {
    types, disabledIds, toggle,
    addType, updateType, removeType,
    addField, updateField, removeField,
    reset,
  } = useRequestTypesStore()

  const [expanded, setExpanded] = useState<string | null>(null)

  // type editor
  const [typeEditor, setTypeEditor] = useState<{ open: boolean; target: RequestType | null }>({ open: false, target: null })
  // field editor
  const [fieldEditor, setFieldEditor] = useState<{ open: boolean; typeId: string; target: FormField | null } | null>(null)
  // confirmations
  const [confirm, setConfirm] = useState<{ title: string; message: string; label: string; run: () => void } | null>(null)

  const isEnabled = (id: string) => !disabledIds.includes(id)
  const enabledCount = types.filter(t => isEnabled(t.id)).length

  const submitType = (form: TypeForm) => {
    const input = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      color: form.color,
      approvalFlow: form.approvalFlow,
      attachments: form.needsAttachment
        ? { required: true, hint: form.attachmentHint.trim() || 'مرفقات مطلوبة' }
        : undefined,
    }
    if (typeEditor.target) updateType(typeEditor.target.id, input)
    else addType({ id: uid('type'), fields: [], ...input })
    setTypeEditor({ open: false, target: null })
  }

  const submitField = (field: FormField) => {
    if (!fieldEditor) return
    if (fieldEditor.target) updateField(fieldEditor.typeId, fieldEditor.target.id, field)
    else addField(fieldEditor.typeId, field)
    setFieldEditor(null)
  }

  return (
    <div className="space-y-4 animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-white/30 font-semibold">
          <span className="text-violet-400 font-black">{enabledCount}</span>
          {' '}نوع مفعّل من{' '}
          <span className="text-white/60">{types.length}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirm({
              title: 'استعادة الأنواع الافتراضية',
              message: 'سيتم إرجاع كل أنواع الطلبات وحقولها إلى الوضع الافتراضي. أي تغييرات قمت بها ستُفقد.',
              label: 'استعادة الافتراضي',
              run: reset,
            })}
            className="btn-outline text-sm"
          >
            <ArrowCounterClockwise size={14} weight="bold" /> استعادة الافتراضي
          </button>
          <button onClick={() => setTypeEditor({ open: true, target: null })} className="btn-primary text-sm">
            <Plus size={15} weight="bold" /> إضافة نوع جديد
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {types.map(type => (
          <div key={type.id}
            className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
              expanded === type.id
                ? 'border border-violet-500/30 shadow-lg shadow-violet-900/20'
                : 'border border-white/[0.06] hover:border-white/[0.12]'
            }`}>

            {/* Row */}
            <div className="flex items-center gap-4 p-4">
              <DotsSixVertical size={18} weight="bold" className="text-white/20 flex-shrink-0" />

              {/* Color dot + title */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: type.color + '20', border: `1px solid ${type.color}40` }}>
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: type.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white/80">{type.title}</p>
                <p className="text-xs text-white/30 truncate">{type.description || '—'}</p>
              </div>

              <span className="text-xs bg-white/[0.06] text-white/35 font-bold px-2.5 py-1 rounded-xl flex-shrink-0">
                {type.fields.length} حقل
              </span>

              {/* Toggle */}
              <button onClick={() => toggle(type.id)}
                className={`flex-shrink-0 transition-colors ${isEnabled(type.id) ? 'text-emerald-400' : 'text-white/20'}`}
                aria-label={isEnabled(type.id) ? 'إيقاف النوع' : 'تفعيل النوع'}
                title={isEnabled(type.id) ? 'مفعّل — اضغط للإيقاف' : 'موقوف — اضغط للتفعيل'}
              >
                {isEnabled(type.id)
                  ? <ToggleRight size={28} weight="fill" />
                  : <ToggleLeft  size={28} weight="fill" />
                }
              </button>

              {/* Edit / Delete */}
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => setTypeEditor({ open: true, target: type })}
                  className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-violet-500/15 flex items-center justify-center text-white/30 hover:text-violet-300 transition-all"
                  aria-label="تعديل النوع"
                >
                  <PencilSimple size={14} weight="bold" />
                </button>
                <button
                  onClick={() => setConfirm({
                    title: 'حذف نوع الطلب',
                    message: `سيتم حذف «${type.title}» وكل حقوله نهائياً. الطلبات المقدّمة سابقاً لن تتأثر.`,
                    label: 'حذف النوع',
                    run: () => removeType(type.id),
                  })}
                  className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-red-500/15 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"
                  aria-label="حذف النوع"
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>

              {/* Expand */}
              <button onClick={() => setExpanded(expanded === type.id ? null : type.id)}
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/60 transition-all flex-shrink-0"
                aria-label="عرض الحقول">
                {expanded === type.id
                  ? <CaretUp   size={14} weight="bold" />
                  : <CaretDown size={14} weight="bold" />
                }
              </button>
            </div>

            {/* Fields */}
            {expanded === type.id && (
              <div className="border-t border-white/[0.06] p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-white/50 uppercase tracking-wider">حقول النموذج</p>
                  <button
                    onClick={() => setFieldEditor({ open: true, typeId: type.id, target: null })}
                    className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-bold"
                  >
                    <Plus size={11} weight="bold" /> إضافة حقل
                  </button>
                </div>

                {type.fields.length === 0 ? (
                  <p className="text-xs text-white/30 py-3 text-center">لا توجد حقول بعد — أضف أول حقل.</p>
                ) : (
                  <div className="space-y-2">
                    {type.fields.map(field => (
                      <div key={field.id}
                        className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 group hover:border-white/[0.1] transition-all">
                        <DotsSixVertical size={13} weight="bold" className="text-white/20" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white/70 truncate">{field.label}</p>
                          <p className="text-xs text-white/25">{fieldTypeLabel(field.type)}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                          field.required
                            ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                            : 'bg-white/[0.05] text-white/25'
                        }`}>
                          {field.required ? 'إلزامي' : 'اختياري'}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setFieldEditor({ open: true, typeId: type.id, target: field })}
                            className="w-7 h-7 rounded-lg hover:bg-violet-500/15 flex items-center justify-center text-white/30 hover:text-violet-400 transition-colors"
                            aria-label="تعديل الحقل"
                          >
                            <PencilSimple size={12} weight="bold" />
                          </button>
                          <button
                            onClick={() => setConfirm({
                              title: 'حذف الحقل',
                              message: `سيتم حذف الحقل «${field.label}» من هذا النوع.`,
                              label: 'حذف الحقل',
                              run: () => removeField(type.id, field.id),
                            })}
                            className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                            aria-label="حذف الحقل"
                          >
                            <Trash size={12} weight="bold" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Editors & confirms */}
      {typeEditor.open && (
        <TypeEditor
          open
          initial={typeEditor.target}
          onClose={() => setTypeEditor({ open: false, target: null })}
          onSubmit={submitType}
        />
      )}

      {fieldEditor?.open && (
        <FieldEditor
          key={fieldEditor.target?.id ?? 'new'}
          open
          initial={fieldEditor.target}
          onClose={() => setFieldEditor(null)}
          onSubmit={submitField}
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
