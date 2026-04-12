export type UserStatus = 'active' | 'inactive'

export interface AdminStats {
  greeting_rows_total: number
}

export interface User {
  id: string
  username: string
  email: string
  status: UserStatus
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateUserInput {
  username: string
  email: string
  password: string
  status?: UserStatus
}
