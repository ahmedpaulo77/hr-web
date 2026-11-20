import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Website (Landing)
import LandingLayout from '@/layouts/LandingLayout'
import HomePage from '@/pages/website/HomePage'
import FeaturesPage from '@/pages/website/FeaturesPage'
import PricingPage from '@/pages/website/PricingPage'
import AboutPage from '@/pages/website/AboutPage'
import ContactPage from '@/pages/website/ContactPage'

// Auth
import AuthLayout from '@/layouts/AuthLayout'
import LoginPage from '@/pages/auth/LoginPage'

// App Layouts
import EmployeeLayout from '@/layouts/EmployeeLayout'
import ManagerLayout from '@/layouts/ManagerLayout'
import AdminLayout from '@/layouts/AdminLayout'

// Employee Pages
import EmployeeDashboard from '@/pages/employee/Dashboard'
import MyRequests from '@/pages/employee/MyRequests'
import NewRequest from '@/pages/employee/NewRequest'

// Manager Pages
import ManagerDashboard from '@/pages/manager/Dashboard'
import PendingApprovals from '@/pages/manager/PendingApprovals'
import TeamRequests from '@/pages/manager/TeamRequests'

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard'
import RequestTypes from '@/pages/admin/RequestTypes'
import Employees from '@/pages/admin/Employees'
import Reports from '@/pages/admin/Reports'
import Settings from '@/pages/admin/Settings'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      {/* ═══ PUBLIC WEBSITE ═══ */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ═══ AUTH ═══ */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ═══ APP REDIRECT ═══ */}
      <Route
        path="/app"
        element={
          !user ? <Navigate to="/login" replace /> :
          user.role === 'admin'    ? <Navigate to="/app/admin"    replace /> :
          user.role === 'manager'  ? <Navigate to="/app/manager"  replace /> :
          <Navigate to="/app/employee" replace />
        }
      />

      {/* ═══ EMPLOYEE ═══ */}
      <Route element={<ProtectedRoute role="employee"><EmployeeLayout /></ProtectedRoute>}>
        <Route path="/app/employee"              element={<EmployeeDashboard />} />
        <Route path="/app/employee/requests"     element={<MyRequests />} />
        <Route path="/app/employee/requests/new" element={<NewRequest />} />
        <Route path="/app/employee/requests/new/:type" element={<NewRequest />} />
      </Route>

      {/* ═══ MANAGER ═══ */}
      <Route element={<ProtectedRoute role="manager"><ManagerLayout /></ProtectedRoute>}>
        <Route path="/app/manager"               element={<ManagerDashboard />} />
        <Route path="/app/manager/approvals"     element={<PendingApprovals />} />
        <Route path="/app/manager/team"          element={<TeamRequests />} />
        <Route path="/app/manager/requests/new"  element={<NewRequest />} />
        <Route path="/app/manager/requests/new/:type" element={<NewRequest />} />
      </Route>

      {/* ═══ ADMIN ═══ */}
      <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="/app/admin"                 element={<AdminDashboard />} />
        <Route path="/app/admin/request-types"   element={<RequestTypes />} />
        <Route path="/app/admin/employees"       element={<Employees />} />
        <Route path="/app/admin/reports"         element={<Reports />} />
        <Route path="/app/admin/settings"        element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
