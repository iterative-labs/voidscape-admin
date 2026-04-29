import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAccountsForUser, useUser } from '@/api/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ACCOUNT_PAGE_SIZE = 25

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const q = useUser(id)
  const [accountPage, setAccountPage] = useState(0)

  useEffect(() => {
    setAccountPage(0)
  }, [id])
  const offset = accountPage * ACCOUNT_PAGE_SIZE
  const aq = useAccountsForUser(q.isSuccess ? id : undefined, {
    limit: ACCOUNT_PAGE_SIZE,
    offset,
  })

  const accountTotal = aq.data?.total ?? 0
  const accountTotalPages = Math.max(
    1,
    Math.ceil(accountTotal / ACCOUNT_PAGE_SIZE),
  )
  const accountRangeStart =
    accountTotal === 0 ? 0 : offset + 1
  const accountRangeEnd = Math.min(
    accountTotal,
    offset + (aq.data?.items.length ?? 0),
  )
  const hasPrevAccounts = accountPage > 0
  const hasNextAccounts =
    (accountPage + 1) * ACCOUNT_PAGE_SIZE < accountTotal

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
        <>
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
              <div>
                <span className="text-muted-foreground">Account IDs </span>
                <span className="font-mono text-xs">
                  {q.data.account_ids.length === 0
                    ? 'none'
                    : `${q.data.account_ids.length} id(s): ${q.data.account_ids.join(', ')}`}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Game accounts</CardTitle>
              <CardDescription>
                GET /accounts?user_id=… with server-side paging (
                {accountTotal} total).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aq.isLoading && (
                <p className="text-muted-foreground text-sm">Loading…</p>
              )}
              {aq.isError && (
                <p className="text-destructive text-sm">{aq.error.message}</p>
              )}
              {aq.isSuccess && aq.data.items.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No game accounts yet.
                </p>
              ) : null}
              {aq.isSuccess && aq.data.items.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Family name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aq.data.items.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">
                            {a.family_name}
                          </TableCell>
                          <TableCell>{a.account_type}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{a.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(a.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null}
              {aq.isSuccess && accountTotal > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!hasPrevAccounts}
                    onClick={() =>
                      setAccountPage((p) => Math.max(0, p - 1))
                    }
                  >
                    Previous
                  </Button>
                  <span className="text-muted-foreground text-sm">
                    Page {accountPage + 1} of {accountTotalPages}
                    {accountTotal > 0
                      ? ` · rows ${accountRangeStart}–${accountRangeEnd} of ${accountTotal}`
                      : ''}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!hasNextAccounts}
                    onClick={() => setAccountPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
