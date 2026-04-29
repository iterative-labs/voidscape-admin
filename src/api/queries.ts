import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'
import type {
  AccountsListResult,
  CreateUserInput,
  StatsSummary,
  User,
  UserDetail,
  UsersListResult,
} from '@/api/types'

export const queryKeys = {
  stats: ['server', 'stats'] as const,
  users: ['server', 'users'] as const,
  user: (id: string) => ['server', 'users', id] as const,
  accounts: (userId: string | null, limit: number, offset: number) =>
    ['server', 'accounts', { userId, limit, offset }] as const,
}

export function useStatsSummary() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => apiFetch<StatsSummary>('/stats'),
  })
}

export function useUsersList(limit = 100, offset = 0) {
  return useQuery({
    queryKey: [...queryKeys.users, { limit, offset }] as const,
    queryFn: () =>
      apiFetch<UsersListResult>(
        `/users?limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(String(offset))}`,
      ),
  })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user(id ?? ''),
    queryFn: () => apiFetch<UserDetail>(`/users/${id}`),
    enabled: Boolean(id),
  })
}

export function useAccountsList(options: {
  userId?: string | null
  limit: number
  offset: number
  enabled?: boolean
}) {
  const { userId, limit, offset, enabled = true } = options
  return useQuery({
    queryKey: queryKeys.accounts(userId ?? null, limit, offset),
    queryFn: () => {
      const p = new URLSearchParams()
      p.set('limit', String(limit))
      p.set('offset', String(offset))
      if (userId) p.set('user_id', userId)
      return apiFetch<AccountsListResult>(`/accounts?${p.toString()}`)
    },
    enabled,
  })
}

export function useAccountsForUser(
  userId: string | undefined,
  options: { limit: number; offset: number },
) {
  const { limit, offset } = options
  return useAccountsList({
    userId: userId ?? null,
    limit,
    offset,
    enabled: Boolean(userId),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateUserInput) =>
      apiFetch<User>('/users', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.users })
      void qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}
