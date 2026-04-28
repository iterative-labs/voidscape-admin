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

export interface GameAccount {
  id: string
  family_name: string
  account_type: GameAccountType
  status: GameAccountStatus
  created_at: string
  updated_at: string
}

export interface UserDetail extends User {
  accounts: GameAccount[]
}

export interface CreateUserInput {
  username: string
  email: string
  password: string
  status?: UserStatus
}
