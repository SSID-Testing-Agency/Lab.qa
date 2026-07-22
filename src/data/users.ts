export type UserRole =
  | 'standard_user'
  | 'locked_out_user'
  | 'problem_user'
  | 'performance_glitch_user'

export interface User {
  username: string
  password: string
  role: UserRole
}

export const USERS: User[] = [
  { username: 'jean_dupont',   password: 'Baguette42!', role: 'standard_user' },
  { username: 'compte_banni',  password: 'Baguette42!', role: 'locked_out_user' },
  { username: 'client_chaos',  password: 'Baguette42!', role: 'problem_user' },
  { username: 'tortue_du_web', password: 'Baguette42!', role: 'performance_glitch_user' },
]

export const USERS_MAP = new Map(USERS.map(u => [u.username, u]))
