import { Bell, MagnifyingGlass, CaretDown, User, SignOut } from '@phosphor-icons/react'
import { useAuthStore } from '@/store/authStore'
import { useEmployeesStore } from '@/store/employeesStore'
import { useRequestsStore } from '@/store/requestsStore'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { currentApprovalRole, isAssignedApprover } from '@/lib/approvals'
import { formatDate } from '@/lib/format'
import ThemeToggle from '@/components/ui/ThemeToggle'

interface TopBarProps { title: string; subtitle?: string }

interface NotificationItem { id: string; text: string; time: string; unread: boolean; to: string }

const roleLabels = { employee: 'موظف', manager: 'مدير مباشر', admin: 'موارد بشرية' } as const

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { user, logout } = useAuthStore()
  const employees = useEmployeesStore(state => state.employees)
  const requests = useRequestsStore(state => state.requests)
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const role = user?.role ?? 'employee'
  const basePath = `/app/${role}`

  /* Notifications are derived from the live requests the user is part of. */
  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = []
    requests.forEach(request => {
      const to = `${basePath}/requests/${request.id}`
      const time = formatDate(request.updatedAt)

      if (isAssignedApprover(request, { id: user?.id, role: user?.role })) {
        items.push({
          id: `todo-${request.id}`,
          text: `بانتظار موافقتك: ${request.typeTitle} — ${request.employeeName}`,
          time,
          unread: true,
          to,
        })
        return
      }

      if (request.employeeId !== user?.id) return
      if (request.status === 'approved') {
        items.push({ id: `approved-${request.id}`, text: `تمت الموافقة على طلبك: ${request.typeTitle}`, time, unread: false, to })
      } else if (request.status === 'rejected') {
        items.push({ id: `rejected-${request.id}`, text: `تم رفض طلبك: ${request.typeTitle}`, time, unread: false, to })
      } else {
        items.push({
          id: `stage-${request.id}`,
          text: `طلبك «${request.typeTitle}» عند ${currentApprovalRole(request) === 'admin' ? 'الموارد البشرية' : 'المدير المباشر'}`,
          time,
          unread: false,
          to,
        })
      }
    })
    return items.sort((a, b) => Number(b.unread) - Number(a.unread)).slice(0, 6)
  }, [requests, basePath, user?.id, user?.role])

  const unreadCount = notifications.filter(item => item.unread).length

  /* Quick search over requests (and employees for HR admins). */
  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []

    const matchedRequests = requests
      .filter(request =>
        request.employeeName.toLowerCase().includes(term) ||
        request.typeTitle.toLowerCase().includes(term) ||
        request.id.toLowerCase().includes(term),
      )
      .slice(0, 5)
      .map(request => ({
        key: `request-${request.id}`,
        label: `${request.employeeName} — ${request.typeTitle}`,
        hint: request.id,
        to: `${basePath}/requests/${request.id}`,
      }))

    const matchedEmployees = role === 'admin'
      ? employees
          .filter(employee =>
            employee.name.toLowerCase().includes(term) ||
            employee.email.toLowerCase().includes(term) ||
            employee.employeeNumber.toLowerCase().includes(term),
          )
          .slice(0, 4)
          .map(employee => ({
            key: `employee-${employee.id}`,
            label: employee.name,
            hint: `${employee.employeeNumber} — ${employee.department}`,
            to: '/app/admin/employees',
          }))
      : []

    return [...matchedRequests, ...matchedEmployees]
  }, [query, requests, employees, role, basePath])

  const closeOverlays = () => {
    setNotifOpen(false)
    setMenuOpen(false)
    setQuery('')
  }

  const goTo = (to: string) => {
    closeOverlays()
    navigate(to)
  }

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

        {/* Closes any open dropdown when the user clicks away */}
        {(notifOpen || menuOpen || results.length > 0) && (
          <div
            onClick={closeOverlays}
            style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          />
        )}

        {/* Search */}
        <div style={{ position: 'relative' }}>
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
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && results[0]) goTo(results[0].to) }}
              placeholder="بحث سريع..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: 13, color: 'rgba(var(--fg-rgb),0.65)',
                fontFamily: 'Cairo, sans-serif', width: '100%',
                direction: 'rtl',
              }}
            />
          </div>

          {results.length > 0 && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute', top: 46, left: 0, zIndex: 100,
                width: 300, borderRadius: 16,
                background: 'var(--popover)',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden', direction: 'rtl',
              }}
            >
              {results.map(result => (
                <button
                  key={result.key}
                  onClick={() => goTo(result.to)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'right',
                    padding: '10px 16px', border: 'none', cursor: 'pointer',
                    background: 'transparent',
                    borderBottom: '1px solid rgba(var(--ov-rgb),0.05)',
                  }}
                >
                  <span style={{
                    display: 'block', fontSize: 12, fontWeight: 700,
                    color: 'rgba(var(--fg-rgb),0.75)', fontFamily: 'Cairo, sans-serif',
                  }}>
                    {result.label}
                  </span>
                  <span style={{
                    display: 'block', fontSize: 10, marginTop: 2,
                    color: 'rgba(var(--fg-rgb),0.35)', fontFamily: 'Cairo, sans-serif',
                  }}>
                    {result.hint}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setMenuOpen(false); setNotifOpen(open => !open) }}
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
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7, borderRadius: '50%',
                background: '#f59e0b',
              }} />
            )}
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
                  {unreadCount} جديد
                </span>
              </div>
              {notifications.length === 0 && (
                <p style={{
                  padding: '20px 16px', fontSize: 12, textAlign: 'center',
                  color: 'rgba(var(--fg-rgb),0.4)', fontFamily: 'Cairo, sans-serif',
                }}>
                  لا توجد إشعارات حالياً
                </p>
              )}
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => goTo(n.to)}
                  style={{
                    display: 'flex', gap: 10, width: '100%', textAlign: 'right',
                    padding: '12px 16px', border: 'none', cursor: 'pointer',
                    borderBottom: '1px solid rgba(var(--ov-rgb),0.05)',
                    background: n.unread ? 'rgba(139,92,246,0.05)' : 'transparent',
                    transition: 'background 0.18s',
                  }}
                >
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
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 11,
            background: 'rgba(var(--ov-rgb),0.04)',
            border: '1px solid rgba(var(--ov-rgb),0.08)',
            cursor: 'pointer', transition: 'all 0.18s',
          }}
            onClick={() => { setNotifOpen(false); setMenuOpen(open => !open) }}
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

          {menuOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute', top: 46, left: 0, zIndex: 100,
                width: 220, borderRadius: 16,
                background: 'var(--popover)',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden', direction: 'rtl',
              }}
            >
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(var(--ov-rgb),0.08)',
              }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Cairo, sans-serif' }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: 11, marginTop: 2, color: 'rgba(var(--fg-rgb),0.45)', fontFamily: 'Cairo, sans-serif' }}>
                  {roleLabels[role]}
                </p>
              </div>

              {role === 'employee' && (
                <button
                  onClick={() => goTo('/app/employee/profile')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '11px 16px', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, textAlign: 'right',
                    color: 'rgba(var(--fg-rgb),0.7)', fontFamily: 'Cairo, sans-serif',
                    borderBottom: '1px solid rgba(var(--ov-rgb),0.05)',
                  }}
                >
                  <User size={15} weight="regular" /> الملف الشخصي
                </button>
              )}

              <button
                onClick={() => { closeOverlays(); logout(); navigate('/login') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '11px 16px', border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, textAlign: 'right',
                  color: '#fb7185', fontFamily: 'Cairo, sans-serif',
                }}
              >
                <SignOut size={15} weight="regular" /> تسجيل الخروج
              </button>
            </div>
          )}
        </div>
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
