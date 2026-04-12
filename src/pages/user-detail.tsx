import { Link, useParams } from 'react-router-dom'
import { useUser } from '@/api/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const q = useUser(id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User</h1>
          <p className="text-muted-foreground font-mono text-sm">{id}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/users">Back to list</Link>
        </Button>
      </div>

      {q.isLoading && (
        <p className="text-muted-foreground text-sm">Loading…</p>
      )}
      {q.isError && (
        <p className="text-destructive text-sm">{q.error.message}</p>
      )}
      {q.isSuccess && (
        <Card>
          <CardHeader>
            <CardTitle>{q.data.username}</CardTitle>
            <CardDescription>{q.data.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex flex-wrap gap-2">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="secondary">{q.data.status}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Created </span>
              {new Date(q.data.created_at).toLocaleString()}
            </div>
            <div>
              <span className="text-muted-foreground">Updated </span>
              {new Date(q.data.updated_at).toLocaleString()}
            </div>
            {q.data.deleted_at && (
              <div>
                <span className="text-muted-foreground">Deleted </span>
                {new Date(q.data.deleted_at).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
