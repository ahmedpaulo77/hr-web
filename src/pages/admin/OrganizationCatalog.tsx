import { useState } from 'react'
import { FloppyDisk, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react'
import { useEmployeesStore } from '@/store/employeesStore'
import { useOrganizationStore } from '@/store/organizationStore'

interface CatalogSectionProps {
  title: string
  description: string
  items: string[]
  countUsage: (name: string) => number
  add: (name: string) => boolean
  rename: (oldName: string, newName: string) => boolean
  remove: (name: string) => boolean
}

function CatalogSection({ title, description, items, countUsage, add, rename, remove }: CatalogSectionProps) {
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const addItem = () => {
    if (!add(newName)) {
      setError(newName.trim() ? 'الاسم موجود بالفعل أو غير صالح.' : 'اكتب الاسم أولاً.')
      return
    }
    setNewName('')
    setError('')
  }

  const saveEdit = () => {
    if (editing && rename(editing, draft)) {
      setEditing(null)
      setError('')
    } else {
      setError('الاسم موجود بالفعل أو غير صالح.')
    }
  }

  const removeItem = (name: string) => {
    if (!remove(name)) {
      setError(`فيه موظفين على «${name}». انقلهم لعنصر آخر قبل الحذف.`)
      return
    }
    setError('')
  }

  return (
    <section className="glass border-gradient overflow-hidden rounded-2xl">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs text-white/35">{description}</p>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={event => { setNewName(event.target.value); setError('') }}
            onKeyDown={event => { if (event.key === 'Enter') addItem() }}
            className="input flex-1"
            placeholder={`اسم ${title === 'الأقسام' ? 'القسم' : 'المسمى الوظيفي'}`}
            aria-label={`اسم ${title === 'الأقسام' ? 'القسم' : 'المسمى الوظيفي'} الجديد`}
          />
          <button type="button" onClick={addItem} className="btn-primary px-4" aria-label="إضافة">
            <Plus size={16} weight="bold" />
          </button>
        </div>
        {error && <p role="alert" className="text-xs font-bold text-amber-300">{error}</p>}

        <div className="divide-y divide-white/[0.05]">
          {items.map(name => (
            <div key={name} className="flex items-center gap-2 py-2.5">
              {editing === name ? (
                <>
                  <input
                    autoFocus
                    value={draft}
                    onChange={event => setDraft(event.target.value)}
                    onKeyDown={event => { if (event.key === 'Enter') saveEdit() }}
                    className="input flex-1"
                    aria-label={`تعديل ${name}`}
                  />
                  <button type="button" onClick={saveEdit} className="rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/10" aria-label="حفظ التعديل">
                    <FloppyDisk size={16} />
                  </button>
                  <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06]" aria-label="إلغاء التعديل">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-bold text-white/75">{name}</span>
                  <span className="text-[11px] text-white/30">{countUsage(name)} موظف</span>
                  <button type="button" onClick={() => { setEditing(name); setDraft(name); setError('') }}
                    className="rounded-lg p-2 text-white/35 hover:bg-violet-500/10 hover:text-violet-300" aria-label={`تعديل ${name}`}>
                    <PencilSimple size={15} />
                  </button>
                  <button type="button" onClick={() => removeItem(name)}
                    className="rounded-lg p-2 text-white/35 hover:bg-red-500/10 hover:text-red-400" aria-label={`حذف ${name}`}>
                    <Trash size={15} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function OrganizationCatalog() {
  const employees = useEmployeesStore(state => state.employees)
  const {
    departments, positions,
    addDepartment, renameDepartment, removeDepartment,
    addPosition, renamePosition, removePosition,
  } = useOrganizationStore()

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <CatalogSection
        title="الأقسام"
        description="إدارة الأقسام المستخدمة في ملفات الموظفين."
        items={departments}
        countUsage={name => employees.filter(employee => employee.department === name).length}
        add={addDepartment}
        rename={renameDepartment}
        remove={removeDepartment}
      />
      <CatalogSection
        title="المسميات الوظيفية"
        description="إدارة المسميات المتاحة عند إضافة موظف أو تعديل بياناته."
        items={positions}
        countUsage={name => employees.filter(employee => employee.position === name).length}
        add={addPosition}
        rename={renamePosition}
        remove={removePosition}
      />
    </div>
  )
}
