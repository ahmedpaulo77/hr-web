import { useRef, useState } from 'react'
import { CloudArrowUp, FilePdf, FileImage, Trash, WarningCircle } from '@phosphor-icons/react'
import type { Attachment } from '@/types'
import { formatFileSize } from '@/lib/format'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png']

interface Props {
  files: Attachment[]
  onChange: (files: Attachment[]) => void
  required?: boolean
  hint?: string
  error?: string
}

export default function FileUpload({ files, onChange, required, hint, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return
    const next: Attachment[] = []
    let message = ''

    for (const file of Array.from(incoming)) {
      if (!ALLOWED.includes(file.type)) {
        message = 'الصيغ المسموحة: PDF, JPG, PNG فقط'
        continue
      }
      if (file.size > MAX_SIZE) {
        message = `الحد الأقصى لحجم الملف 10MB (${file.name})`
        continue
      }
      next.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }

    setLocalError(message)
    if (next.length) onChange([...files, ...next])
    if (inputRef.current) inputRef.current.value = ''
  }

  const shownError = error || localError

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-black text-white/50 uppercase tracking-wider">
          المرافقات
          {required && <span className="text-red-400 mr-1">*</span>}
        </label>
        <span className="text-[10px] font-bold text-white/25">PDF, JPG, PNG — حتى 10MB</span>
      </div>

      <label
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-violet-500/60 bg-violet-500/10'
            : shownError
              ? 'border-red-500/40 bg-red-500/[0.04]'
              : 'border-white/[0.1] hover:border-violet-500/40 hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
        <CloudArrowUp size={26} weight="duotone" className="text-violet-400/70" />
        <p className="text-sm text-white/40 mt-1">
          اسحب الملفات هنا أو <span className="text-violet-400 font-bold">اختر ملفاً</span>
        </p>
        {hint && <p className="text-[11px] text-white/25 mt-0.5">{hint}</p>}
      </label>

      {shownError && (
        <p className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mt-1.5">
          <WarningCircle size={13} weight="fill" /> {shownError}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map(file => {
            const Icon = file.type === 'application/pdf' ? FilePdf : FileImage
            return (
              <li key={file.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                <Icon size={18} weight="duotone" className="text-violet-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white/70 truncate">{file.name}</p>
                  <p className="text-[10px] text-white/25">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(files.filter(f => f.id !== file.id))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label={`حذف ${file.name}`}
                >
                  <Trash size={13} weight="bold" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
