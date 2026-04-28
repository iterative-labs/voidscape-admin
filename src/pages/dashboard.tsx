import { useAdminStats } from '@/api/queries'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function DashboardPage() {
  const q = useAdminStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Read-only stats from voidscape-server.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active users & accounts</CardTitle>
          <CardDescription>
            Rows with status active and not soft-deleted (management view).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {q.isLoading && (
            <p className="text-muted-foreground text-sm">Loading…</p>
          )}
          {q.isError && (
            <p className="text-destructive text-sm sm:col-span-2">
              {q.error.message}
            </p>
          )}
          {q.isSuccess && (
            <>
              <div>
                <p className="text-muted-foreground text-sm">Active users</p>
                <p className="text-3xl font-mono tabular-nums">
                  {q.data.active_users_total}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Active accounts
                </p>
                <p className="text-3xl font-mono tabular-nums">
                  {q.data.active_accounts_total}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
