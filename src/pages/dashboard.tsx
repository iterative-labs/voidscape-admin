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
          <CardTitle>Greeting log</CardTitle>
          <CardDescription>Rows in greeting_log (admin view)</CardDescription>
        </CardHeader>
        <CardContent>
          {q.isLoading && (
            <p className="text-muted-foreground text-sm">Loading…</p>
          )}
          {q.isError && (
            <p className="text-destructive text-sm">{q.error.message}</p>
          )}
          {q.isSuccess && (
            <p className="text-3xl font-mono tabular-nums">
              {q.data.greeting_rows_total}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
