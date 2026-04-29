export type UserStatus = 'active' | 'inactive'

export type GameAccountType = 'regular'
export type GameAccountStatus = 'active' | 'inactive'

/** Response body from the management API GET /stats */
export interface StatsSummary {
  active_users_total: number
  active_accounts_total: number
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

/** GET /users paginated response */
export interface UsersListResult {
  users: User[]
  total: number
}

export interface GameAccount {
  id: string
  /** Login user that owns this game account */
  user_id: string
  family_name: string
  account_type: GameAccountType
  status: GameAccountStatus
  created_at: string
  updated_at: string
}

/** GET /accounts (optional `user_id` filter) paginated response */
export interface AccountsListResult {
  items: GameAccount[]
  total: number
}

export interface UserDetail extends User {
  /** Non-deleted game account IDs for this login */
  account_ids: string[]
}

export interface CreateUserInput {
  username: string
  email: string
  password: string
  status?: UserStatus
}
