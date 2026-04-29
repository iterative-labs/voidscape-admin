import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/routes/layout'
import { AccountsPage } from '@/pages/accounts'
import { DashboardPage } from '@/pages/dashboard'
import { UserDetailPage } from '@/pages/user-detail'
import { UserNewPage } from '@/pages/user-new'
import { UsersPage } from '@/pages/users'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<UserNewPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
