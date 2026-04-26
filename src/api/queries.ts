import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'
import type { CreateUserInput, User } from '@/api/types'

export const queryKeys = {
  users: ['admin', 'users'] as const,
  user: (id: string) => ['admin', 'users', id] as const,
}

export function useUsersList(limit = 100, offset = 0) {
  return useQuery({
    queryKey: [...queryKeys.users, { limit, offset }] as const,
    queryFn: () =>
      apiFetch<User[]>(
        `/admin/users?limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(String(offset))}`,
      ),
  })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user(id ?? ''),
    queryFn: () => apiFetch<User>(`/admin/users/${id}`),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateUserInput) =>
      apiFetch<User>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}
