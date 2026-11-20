import { useMemo, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useEmployeesStore } from '@/store/employeesStore'
import { useHrOperationsStore, type EmployeeDocument } from '@/store/hrOperationsStore'
import { deleteDocument, openDocument, saveDocument } from '@/lib/documentVault'
import { CloudArrowUp, DownloadSimple, FilePdf, IdentificationCard, Trash, UserCircle } from '@phosphor-icons/react'

const documentCategories = [
  { id: 'national-id', label: 'الهوية الوطنية' },
  { id: 'residence', label: 'الإقامة' },
  { id: 'passport', label: 'جواز السفر' },
  { id: 'family-card', label: 'كرت العائلة' },
  { id: 'dependent-documents', label: 'مستندات التابعين' },
  { id: 'iban', label: 'صورة الآيبان' },
  { id: 'qualification', label: 'المؤهل العلمي' },
  { id: 'cv', label: 'السيرة الذاتية' },
  { id: 'courses-experience', label: 'الدورات والخبرات' },
  { id: 'admin-decisions', label: 'القرارات الإدارية' },
]

const EMPTY_DOCUMENTS: EmployeeDocument[] = []

const formatSize = (size: number) => size < 1024 * 1024
  ? `${Math.max(1, Math.round(size / 1024))} كيلوبايت`
  : `${(size / (1024 * 1024)).toFixed(1)} ميجابايت`

export default function EmployeeProfile() {
  const { user } = useAuthStore()
  const employee = useEmployeesStore(state => state.employees.find(item => item.id === user?.id))
  const documents = useHrOperationsStore(state => state.documents[user?.id ?? ''] ?? EMPTY_DOCUMENTS)
  const addDocument = useHrOperationsStore(state => state.addDocument)
  const removeDocument = useHrOperationsStore(state => state.removeDocument)
  const [busyCategory, setBusyCategory] = useState<string | null>(null)
  const [error, setError] = useState('')

  const documentsByCategory = useMemo(() => {
    const groups = new Map<string, EmployeeDocument[]>()
    for (const document of documents) groups.set(document.category, [...(groups.get(document.category) ?? []), document])
    return groups
  }, [documents])

  if (!employee || !user) {
    return <div className="glass border-gradient rounded-2xl p-8 text-center text-white/45">تعذر تحميل ملف الموظف.</div>
  }

  const upload = async (category: string, file?: File) => {
    if (!file) return
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setError('الصيغ المسموحة: PDF وJPG وPNG.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('الحد الأقصى لحجم الملف 10 ميجابايت.')
      return
    }

    setError('')
    setBusyCategory(category)
    const document: EmployeeDocument = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      employeeId: employee.id,
      category,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }
    try {
      await saveDocument(document, file)
      addDocument(document)
    } catch {
      setError('تعذر حفظ الملف في هذا المتصفح. حاول مرة أخرى.')
    } finally {
      setBusyCategory(null)
    }
  }

  const remove = async (document: EmployeeDocument) => {
    await deleteDocument(document.id)
    removeDocument(employee.id, document.id)
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">ملفي ومستنداتي</h2>
          <p className="mt-1 text-sm text-white/35">بياناتك الأساسية والمستندات المرتبطة بملفك الوظيفي.</p>
        </div>
        <span className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/45">
          <IdentificationCard size={16} /> {employee.employeeNumber}
        </span>
      </div>

      <div className="glass border-gradient flex flex-wrap items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
          <UserCircle size={30} weight="duotone" />
        </div>
        <div className="min-w-[200px] flex-1">
          <h3 className="font-black text-white">{employee.name}</h3>
          <p className="mt-1 text-xs text-white/40">{employee.position} · {employee.department}</p>
        </div>
        <div className="text-xs leading-6 text-white/40">
          <p>{employee.email}</p><p>{employee.location}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {documentCategories.map(category => {
          const categoryDocuments = documentsByCategory.get(category.id) ?? []
          return (
            <section key={category.id} className="glass border-gradient overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
                <div>
                  <h3 className="text-sm font-black text-white/80">{category.label}</h3>
                  <p className="mt-1 text-[10px] text-white/25">PDF أو صورة · حتى 10 ميجابايت</p>
                </div>
                <label className={`flex cursor-pointer items-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-300 hover:bg-violet-500/15 ${busyCategory === category.id ? 'opacity-50' : ''}`}>
                  <CloudArrowUp size={15} />
                  {busyCategory === category.id ? 'جاري الرفع' : 'رفع'}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    disabled={busyCategory === category.id}
                    onChange={event => {
                      void upload(category.id, event.currentTarget.files?.[0])
                      event.currentTarget.value = ''
                    }}
                  />
                </label>
              </div>
              <ul className="divide-y divide-white/[0.04]">
                {categoryDocuments.length ? categoryDocuments.map(document => (
                  <li key={document.id} className="flex items-center gap-3 px-4 py-3">
                    <FilePdf size={19} weight="duotone" className="shrink-0 text-violet-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-white/65">{document.name}</p>
                      <p className="mt-1 text-[10px] text-white/25">{formatSize(document.size)} · {new Date(document.uploadedAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <button onClick={() => void openDocument(document.id)} title="فتح الملف" className="rounded-lg p-2 text-white/35 hover:bg-white/[0.05] hover:text-violet-300">
                      <DownloadSimple size={15} />
                    </button>
                    <button onClick={() => void remove(document)} title="حذف الملف" className="rounded-lg p-2 text-white/35 hover:bg-rose-500/10 hover:text-rose-300">
                      <Trash size={15} />
                    </button>
                  </li>
                )) : (
                  <li className="px-4 py-5 text-center text-xs text-white/25">لا توجد مستندات مرفوعة في هذا القسم.</li>
                )}
              </ul>
            </section>
          )
        })}
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/[0.06] px-4 py-3 text-sm text-rose-300">{error}</p>}
      <p className="text-[11px] leading-relaxed text-white/25">
        الملفات محفوظة محليًا في هذا المتصفح ضمن النموذج التجريبي، وليست مرفوعة إلى خادم الشركة.
      </p>
    </div>
  )
}
