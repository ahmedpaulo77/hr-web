import { useState } from 'react'
import { requestTypes as defaultTypes } from '@/data/requestTypes'
import { Plus, Trash, PencilSimple, DotsSixVertical, ToggleLeft, ToggleRight, CaretDown, CaretUp } from '@phosphor-icons/react'

export default function RequestTypes() {
  const [types,    setTypes]    = useState(defaultTypes.map(t => ({ ...t, enabled: true })))
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) =>
    setTypes(prev => prev.map(t => t.id === id ? { ...t, enabled: !(t as any).enabled } : t))

  return (
    <div className="space-y-4 animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/30 font-semibold">
          <span className="text-violet-400 font-black">{types.filter((t: any) => t.enabled).length}</span>
          {' '}نوع مفعّل من{' '}
          <span className="text-white/60">{types.length}</span>
        </p>
        <button className="btn-primary text-sm">
          <Plus size={15} weight="bold" /> إضافة نوع جديد
        </button>
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
              <DotsSixVertical size={18} weight="bold" className="text-white/20 cursor-grab flex-shrink-0" />

              {/* Color dot + title */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: type.color + '20', border: `1px solid ${type.color}40` }}>
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: type.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white/80">{type.title}</p>
                <p className="text-xs text-white/30 truncate">{type.description}</p>
              </div>

              <span className="text-xs bg-white/[0.06] text-white/35 font-bold px-2.5 py-1 rounded-xl flex-shrink-0">
                {type.fields.length} حقل
              </span>

              {/* Toggle */}
              <button onClick={() => toggle(type.id)}
                className={`flex-shrink-0 transition-colors ${(type as any).enabled ? 'text-emerald-400' : 'text-white/20'}`}>
                {(type as any).enabled
                  ? <ToggleRight size={28} weight="fill" />
                  : <ToggleLeft  size={28} weight="fill" />
                }
              </button>

              {/* Expand */}
              <button onClick={() => setExpanded(expanded === type.id ? null : type.id)}
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/60 transition-all flex-shrink-0">
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
                  <button className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-bold">
                    <Plus size={11} weight="bold" /> إضافة حقل
                  </button>
                </div>
                <div className="space-y-2">
                  {type.fields.map(field => (
                    <div key={field.id}
                      className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 group hover:border-white/[0.1] transition-all">
                      <DotsSixVertical size={13} weight="bold" className="text-white/20 cursor-grab" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white/70">{field.label}</p>
                        <p className="text-xs text-white/25">
                          {field.type === 'text'     ? 'نص' :
                           field.type === 'select'   ? 'قائمة اختيار' :
                           field.type === 'date'     ? 'تاريخ' :
                           field.type === 'number'   ? 'رقم' :
                           field.type === 'textarea' ? 'نص طويل' : 'ملف'}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                        field.required
                          ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                          : 'bg-white/[0.05] text-white/25'
                      }`}>
                        {field.required ? 'إلزامي' : 'اختياري'}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded-lg hover:bg-violet-500/15 flex items-center justify-center text-white/30 hover:text-violet-400 transition-colors">
                          <PencilSimple size={12} weight="bold" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors">
                          <Trash size={12} weight="bold" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
