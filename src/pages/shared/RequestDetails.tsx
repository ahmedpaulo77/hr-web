import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, FileText, Paperclip, Check, X, Prohibit, Printer,
} from '@phosphor-icons/react'
import { useRequestsStore } from '@/store/requestsStore'
import { useAuthStore } from '@/store/authStore'
import { getRequestType } from '@/data/requestTypes'
import { getEmployeeByEmail } from '@/data/employees'
import { requestsForManager } from '@/lib/requests'
import { approvalFlowFor, approvalStageFor, currentApprovalRole, isAssignedApprover } from '@/lib/approvals'
import { formatDate, formatDateTime } from '@/lib/format'
import { iconForType } from '@/lib/requestIcons'
import Badge from '@/components/ui/Badge'
import Timeline from '@/components/ui/Timeline'
import ReasonDialog from '@/components/ui/ReasonDialog'
import type { FieldValue } from '@/types'

const displayValue = (value: FieldValue | undefined, type?: string) => {
  if (value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'موافق' : 'غير موافق'
  if (type === 'date') return formatDate(value)
  return value
}

export default function RequestDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { requests, approve, reject, cancel } = useRequestsStore()
  const [dialog, setDialog] = useState<'approve' | 'reject' | 'cancel' | null>(null)

  const found = requests.find(r => r.id === id)
  const role = user?.role ?? 'employee'
  const basePath = `/app/${role}`

  // Role-based visibility: employees see their own, managers see their team, admins see all
  const request =
    !found ? undefined
    : role === 'employee'
      ? (found.employeeId === user?.id ? found : undefined)
      : role === 'manager'
        ? (requestsForManager(requests, user?.id).some(r => r.id === found.id) ? found : undefined)
        : found
  const backTo =
    role === 'employee' ? `${basePath}/requests`
    : role === 'manager' ? `${basePath}/team`
    : `${basePath}/requests`

  if (!request) {
    return (
      <div className="glass border-gradient p-16 text-center rounded-3xl animate-fade-up max-w-lg mx-auto">
        <FileText size={40} weight="duotone" className="text-white/20 mx-auto mb-4" />
        <p className="text-lg font-black text-white mb-1">الطلب غير موجود</p>
        <p className="text-sm text-white/35 mb-5">ربما تم حذفه أو أن الرابط غير صحيح.</p>
        <button onClick={() => navigate(backTo)} className="btn-primary mx-auto">
          <ArrowRight size={15} weight="bold" /> رجوع
        </button>
      </div>
    )
  }

  const type = getRequestType(request.typeId)
  const TypeIcon = iconForType(request.typeId)
  const employee = getEmployeeByEmail(request.employeeId)
  const actor = {
    id: user?.id,
    userRole: user?.role,
    name: user?.name ?? '',
    role: role === 'manager' ? 'مدير' : role === 'admin' ? 'موارد بشرية' : 'موظف',
  }

  const isOwner = request.employeeId === user?.id
  const canCancel = isOwner && request.status === 'pending'
  const canDecide = isAssignedApprover(request, { id: user?.id, role: user?.role })

  const knownFields = (type?.fields ?? []).filter(f => f.type !== 'dependent' && !f.hidden)
  const knownIds = new Set(knownFields.map(f => f.id))
  const extraFields = Object.keys(request.values)
    .filter(key => !knownIds.has(key) && key !== 'dependent_id')
    .map(key => ({ id: key, label: key, type: 'text' as const }))
  const decidedFields = [...knownFields, ...extraFields]
  const approvalFlow = approvalFlowFor(request)
  const approvalStage = approvalStageFor(request)
  const activeApprovalRole = currentApprovalRole(request)

  return (
    <div className="space-y-5 animate-fade-up max-w-6xl">

      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <button
          onClick={() => navigate(backTo)}
          className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all flex-shrink-0"
          aria-label="رجوع"
        >
          <ArrowRight size={18} weight="bold" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0"
              style={{
                backgroundColor: (type?.color ?? '#8b5cf6') + '1a',
                borderColor: (type?.color ?? '#8b5cf6') + '33',
              }}
            >
              <TypeIcon size={18} weight="duotone" style={{ color: type?.color ?? '#a78bfa' }} />
            </span>
            <h2 className="text-xl font-black text-white">{request.typeTitle}</h2>
            <Badge status={request.status} />
          </div>
          <p className="text-xs text-white/30 mt-1 font-mono">{request.id}</p>
        </div>

        <div className="flex items-center gap-2">
          {canCancel && (
            <button
              onClick={() => setDialog('cancel')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] text-white/50 font-bold text-sm border border-white/[0.08] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
            >
              <Prohibit size={15} weight="bold" /> إلغاء الطلب
            </button>
          )}
          {canDecide && (
            <>
              <button
                onClick={() => setDialog('approve')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-sm border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors"
              >
                <Check size={15} weight="bold" /> موافقة
              </button>
              <button
                onClick={() => setDialog('reject')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 text-red-400 font-bold text-sm border border-red-500/20 hover:bg-red-500/25 transition-colors"
              >
                <X size={15} weight="bold" /> رفض
              </button>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/35 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
            aria-label="طباعة"
            title="طباعة الطلب"
          >
            <Printer size={17} weight="duotone" />
          </button>
        </div>
      </div>

      {request.status === 'rejected' && request.rejectionReason && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
          <p className="text-xs font-black text-red-400 mb-1">سبب الرفض</p>
          <p className="text-sm text-white/60 leading-relaxed">{request.rejectionReason}</p>
        </div>
      )}

      <section className="glass border-gradient rounded-2xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-black text-white">مسار الموافقات</h3>
          <span className="text-xs font-bold text-white/40">
            {request.status === 'approved'
              ? 'اكتملت جميع المراحل'
              : ['pending', 'processing'].includes(request.status) && activeApprovalRole
                ? `بانتظار ${activeApprovalRole === 'admin' ? 'الموارد البشرية' : 'المدير المباشر'}`
                : request.status === 'rejected' ? 'توقف المسار بعد الرفض' : 'انتهى الطلب'}
          </span>
        </div>
        <ol className="grid gap-2 sm:grid-cols-2">
          {approvalFlow.map((stage, index) => {
            const complete = request.status === 'approved' || index < approvalStage
            const current = ['pending', 'processing'].includes(request.status) && index === approvalStage
            return (
              <li key={`${stage}-${index}`} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                current ? 'border-violet-400/30 bg-violet-500/10' : complete ? 'border-emerald-500/20 bg-emerald-500/[0.05]' : 'border-white/[0.06] bg-white/[0.02]'
              }`}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${
                  complete ? 'bg-emerald-500/15 text-emerald-300' : current ? 'bg-violet-500/20 text-violet-300' : 'bg-white/[0.06] text-white/30'
                }`}>{complete ? <Check size={14} weight="bold" /> : index + 1}</span>
                <div>
                  <p className="text-xs font-black text-white/75">{stage === 'admin' ? 'الموارد البشرية' : 'المدير المباشر'}</p>
                  <p className="text-[10px] text-white/35">{complete ? 'تمت الموافقة' : current ? 'بانتظار الموافقة' : 'في انتظار المرحلة السابقة'}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <div className="grid lg:grid-cols-3 gap-5 items-start">

        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass border-gradient p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-white">بيانات الطلب</h3>
              <span className="text-[11px] text-white/25">{formatDateTime(request.submittedAt)}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {decidedFields.map(field => (
                <div key={field.id} className="min-w-0">
                  <p className="text-[10px] font-black text-white/25 uppercase tracking-wider mb-1">{field.label}</p>
                  <p className="text-sm font-bold text-white/70 break-words">
                    {displayValue(request.values[field.id], field.type)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass border-gradient p-6">
            <h3 className="font-black text-white mb-4 flex items-center gap-2">
              <Paperclip size={16} weight="duotone" className="text-violet-400" />
              المرفقات
              <span className="text-xs font-bold text-white/25">({request.attachments.length})</span>
            </h3>
            {request.attachments.length === 0 ? (
              <p className="text-sm text-white/30">لا توجد مرفقات على هذا الطلب.</p>
            ) : (
              <ul className="space-y-2">
                {request.attachments.map(file => (
                  <li key={file.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                    <span className="text-xs font-bold text-white/70 truncate">{file.name}</span>
                    <span className="text-[10px] text-white/25 flex-shrink-0">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Side */}
        <div className="space-y-5">
          <div className="glass border-gradient p-5">
            <h3 className="font-black text-white mb-4">متابعة الطلب</h3>
            <Timeline events={request.timeline} />
          </div>

          {employee && (
            <div className="glass border-gradient p-5 rounded-2xl">
              <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-3">مقدم الطلب</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center font-black text-[#fff] shadow-lg">
                  {employee.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-white/80 truncate">{employee.name}</p>
                  <p className="text-[11px] text-white/30 truncate">{employee.position} · {employee.department}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-white/30 space-y-1">
                <p>رقم الموظف: <span className="text-white/55 font-bold">{employee.employeeNumber}</span></p>
                <p>تاريخ التعيين: <span className="text-white/55 font-bold">{formatDate(employee.hireDate)}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReasonDialog
        open={dialog === 'approve'}
        title="الموافقة على الطلب"
        description="سيتم تحويل الطلب إلى «تمت الموافقة» وإشعار الموظف."
        confirmLabel="تأكيد الموافقة"
        tone="success"
        requireReason={false}
        onClose={() => setDialog(null)}
        onConfirm={() => { approve(request.id, actor); setDialog(null) }}
      />

      <ReasonDialog
        open={dialog === 'reject'}
        title="رفض الطلب"
        description="اكتب سبب الرفض ليظهر للموظف في صفحة الطلب."
        confirmLabel="تأكيد الرفض"
        tone="danger"
        onClose={() => setDialog(null)}
        onConfirm={reason => { reject(request.id, actor, reason); setDialog(null) }}
      />

      <ReasonDialog
        open={dialog === 'cancel'}
        title="إلغاء الطلب"
        description="سيتم إلغاء الطلب ولا يمكن التراجع عن هذا الإجراء."
        confirmLabel="نعم، إلغاء الطلب"
        tone="danger"
        requireReason={false}
        onClose={() => setDialog(null)}
        onConfirm={reason => { cancel(request.id, actor); setDialog(null) }}
      />
    </div>
  )
}
