import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar'
import TopBar from '@/components/ui/TopBar'
import { SquaresFour, FileText, PlusCircle } from '@phosphor-icons/react'

const navItems = [
  { label: 'الرئيسية',  path: '/app/employee',              icon: SquaresFour },
  { label: 'طلباتي',    path: '/app/employee/requests',     icon: FileText    },
  { label: 'طلب جديد',  path: '/app/employee/requests/new', icon: PlusCircle  },
]

const titles: Record<string, { title: string; subtitle: string }> = {
  '/app/employee':              { title: 'الرئيسية',  subtitle: 'مرحباً بك في بوابة الموظفين' },
  '/app/employee/requests':     { title: 'طلباتي',    subtitle: 'تابع جميع طلباتك' },
  '/app/employee/requests/new': { title: 'طلب جديد',  subtitle: 'اختر نوع الطلب' },
}

export default function EmployeeLayout() {
  const location = useLocation()
  const page = titles[location.pathname] || { title: 'HR Portal', subtitle: '' }

  return (
    /* RTL container: sidebar on right, content on left */
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-base)',
    }}>
      <div className="mesh-bg" />
      <Sidebar navItems={navItems} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 10 }}>
        <TopBar title={page.title} subtitle={page.subtitle} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', direction: 'rtl' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
