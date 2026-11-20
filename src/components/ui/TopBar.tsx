import { Bell, MagnifyingGlass, CaretDown } from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import ThemeToggle from '@/components/ui/ThemeToggle'

interface TopBarProps { title: string; subtitle?: string }

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { user } = useAuthStore()
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { id: 1, text: 'تمت الموافقة على طلب تثبيت الراتب', time: 'منذ 5 دقائق',  unread: true  },
    { id: 2, text: 'طلب سلفة جديد بانتظار موافقتك',    time: 'منذ 20 دقيقة', unread: true  },
    { id: 3, text: 'تم رفض طلب إجازة',                 time: 'منذ ساعة',     unread: false },
  ]

  return (
    /* RTL row: title on right, actions on left */
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--topbar)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139,92,246,0.1)',
    }}>

      {/* Title — RIGHT side */}
      <div style={{ direction: 'rtl', textAlign: 'right' }} className="animate-fade-up">
        <h1 style={{
          fontSize: 18, fontWeight: 900, color: 'var(--ink)',
          letterSpacing: '-0.3px', fontFamily: 'Cairo, sans-serif',
          lineHeight: 1.2,
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            fontSize: 12, color: 'rgba(var(--fg-rgb),0.4)',
            marginTop: 2, fontFamily: 'Cairo, sans-serif', fontWeight: 500,
          }}>{subtitle}</p>
        )}
      </div>

      {/* Actions — LEFT side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px',
          borderRadius: 12,
          background: 'rgba(var(--ov-rgb),0.04)',
          border: '1px solid rgba(var(--ov-rgb),0.08)',
          width: 200,
        }} className="topbar-search">
          <MagnifyingGlass size={14} weight="regular" color="rgba(var(--fg-rgb),0.3)" />
          <input
            type="text"
            placeholder="بحث سريع..."
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 13, color: 'rgba(var(--fg-rgb),0.65)',
              fontFamily: 'Cairo, sans-serif', width: '100%',
              direction: 'rtl',
            }}
          />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'rgba(var(--ov-rgb),0.04)',
              border: '1px solid rgba(var(--ov-rgb),0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(var(--fg-rgb),0.5)', cursor: 'pointer',
              position: 'relative', transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(var(--ov-rgb),0.08)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(var(--fg-rgb),0.9)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(var(--ov-rgb),0.04)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(var(--fg-rgb),0.5)'
            }}
          >
            <Bell size={17} weight="regular" />
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 7, height: 7, borderRadius: '50%',
              background: '#f59e0b',
            }} />
          </button>

          {notifOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute', top: 46, left: 0,
                width: 300, borderRadius: 16,
                background: 'var(--popover)',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden', zIndex: 100,
                direction: 'rtl',
              }}
            >
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(var(--ov-rgb),0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Cairo, sans-serif' }}>
                  الإشعارات
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: '#c4b5fd',
                  background: 'rgba(139,92,246,0.2)', padding: '2px 8px', borderRadius: 6,
                }}>
                  {notifications.filter(n => n.unread).length} جديد
                </span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(var(--ov-rgb),0.05)',
                  display: 'flex', gap: 10, cursor: 'pointer',
                  background: n.unread ? 'rgba(139,92,246,0.05)' : 'transparent',
                  transition: 'background 0.18s',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: n.unread ? '#8b5cf6' : 'transparent',
                  }} />
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(var(--fg-rgb),0.7)', lineHeight: 1.6, fontFamily: 'Cairo, sans-serif' }}>
                      {n.text}
                    </p>
                    <p style={{ fontSize: 10, color: 'rgba(var(--fg-rgb),0.4)', marginTop: 3, fontFamily: 'Cairo, sans-serif' }}>
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 11,
          background: 'rgba(var(--ov-rgb),0.04)',
          border: '1px solid rgba(var(--ov-rgb),0.08)',
          cursor: 'pointer', transition: 'all 0.18s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(var(--ov-rgb),0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(var(--ov-rgb),0.04)'}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: '#fff', fontSize: 12,
          }}>
            {user?.name?.charAt(0)}
          </div>
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: 'rgba(var(--fg-rgb),0.7)',
            fontFamily: 'Cairo, sans-serif',
            maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }} className="topbar-name">
            {user?.name?.split(' ')[0]}
          </span>
          <CaretDown size={11} weight="bold" color="rgba(var(--fg-rgb),0.3)" className="topbar-caret" />
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .topbar-search { display: none !important; }
          .topbar-name   { display: none !important; }
          .topbar-caret  { display: none !important; }
        }
      `}</style>
    </header>
  )
}
