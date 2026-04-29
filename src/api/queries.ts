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
  accountsForUser: (userId: string, limit: number, offset: number) =>
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

export function useAccountsForUser(
  userId: string | undefined,
  options: { limit: number; offset: number },
) {
  const { limit, offset } = options
  return useQuery({
    queryKey: queryKeys.accountsForUser(userId ?? '', limit, offset),
    queryFn: () =>
      apiFetch<AccountsListResult>(
        `/accounts?user_id=${encodeURIComponent(userId!)}&limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(String(offset))}`,
      ),
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
