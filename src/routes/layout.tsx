import { Link, Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/users/new', label: 'New user' },
]

export function AppLayout() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">
            Voidscape Admin
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex flex-wrap gap-4 text-sm">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
