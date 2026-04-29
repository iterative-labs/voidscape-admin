import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountsList } from '@/api/queries'
import type { GameAccount } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ACCOUNTS_PAGE_SIZE = 50

export function AccountsPage() {
  const [page, setPage] = useState(0)
  const accountsQ = useAccountsList({
    limit: ACCOUNTS_PAGE_SIZE,
    offset: page * ACCOUNTS_PAGE_SIZE,
  })

  const rows: GameAccount[] = accountsQ.data?.items ?? []
  const total = accountsQ.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / ACCOUNTS_PAGE_SIZE))
  const rangeStart = total === 0 ? 0 : page * ACCOUNTS_PAGE_SIZE + 1
  const rangeEnd = Math.min(total, page * ACCOUNTS_PAGE_SIZE + rows.length)

  const hasPrevPage = page > 0
  const hasNextPage = (page + 1) * ACCOUNTS_PAGE_SIZE < total

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground text-sm">
          Visible game accounts from GET /accounts (paginated).
        </p>
      </div>

      {accountsQ.isLoading && (
        <p className="text-muted-foreground text-sm">Loading accounts…</p>
      )}
      {accountsQ.isError && (
        <p className="text-destructive text-sm">{accountsQ.error.message}</p>
      )}

      {accountsQ.isSuccess ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Family name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length ? (
                  rows.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">
                        <Link
                          className="text-primary hover:underline"
                          to={`/users/${a.user_id}`}
                        >
                          {a.user_id}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{a.family_name}</TableCell>
                      <TableCell>{a.account_type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{a.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(a.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(a.updated_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground h-24 text-center"
                    >
                      No game accounts.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {page + 1} of {totalPages}
              {total > 0
                ? ` · rows ${rangeStart}–${rangeEnd} of ${total}`
                : ''}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}
