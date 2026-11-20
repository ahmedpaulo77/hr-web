import { useEffect, useState } from 'react'
import { X } from '@phosphor-icons/react'

interface Props {
  open: boolean
  title: string
  description?: string
  confirmLabel: string
  cancelLabel?: string
  tone?: 'danger' | 'success' | 'neutral'
  requireReason?: boolean
  onConfirm: (reason: string) => void
  onClose: () => void
}

const toneClass = {
  danger:  'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25',
  neutral: 'bg-violet-500/15 text-violet-300 border border-violet-500/20 hover:bg-violet-500/25',
}

export default function ReasonDialog({
  open, title, description, confirmLabel, cancelLabel = 'رجوع',
  tone = 'neutral', requireReason = true, onConfirm, onClose,
}: Props) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  // Clear the previous reason whenever the dialog opens
  useEffect(() => {
    if (open) {
      setReason('')
      setError('')
    }
  }, [open])

  if (!open) return null

  const submit = () => {
    if (requireReason && !reason.trim()) {
      setError('يرجى كتابة السبب')
      return
    }
    onConfirm(reason.trim())
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass border-gradient rounded-3xl p-6 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
          aria-label="إغلاق"
        >
          <X size={14} weight="bold" />
        </button>

        <h3 className="text-lg font-black text-white mb-1">{title}</h3>
        {description && <p className="text-sm text-white/40 leading-relaxed mb-4">{description}</p>}

        <textarea
          rows={3}
          value={reason}
          onChange={e => { setReason(e.target.value); setError('') }}
          placeholder="اكتب السبب هنا..."
          className="input resize-none mt-3"
        />
        {error && <p className="text-xs text-red-400 font-semibold mt-1.5">{error}</p>}

        <div className="flex gap-2 mt-5">
          <button onClick={submit} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${toneClass[tone]}`}>
            {confirmLabel}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white/50 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
