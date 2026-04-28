import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateUser } from '@/api/queries'
import type { UserStatus } from '@/api/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function UserNewPage() {
  const navigate = useNavigate()
  const create = useCreateUser()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<UserStatus>('active')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const u = await create.mutateAsync({
      username,
      email,
      password,
      status,
    })
    navigate(`/users/${u.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New user</h1>
        <p className="text-muted-foreground text-sm">
          Creates a user via POST /users.
        </p>
      </div>
      <Card className="max-w-md">
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-col gap-4"
        >
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Username must be unique.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>
            {create.isError && (
              <p className="text-destructive text-sm">{create.error.message}</p>
            )}
          </CardContent>
          <CardFooter className="shrink-0 gap-2">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating…' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
