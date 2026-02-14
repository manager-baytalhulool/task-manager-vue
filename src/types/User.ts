interface User {
  serial_number: number
  id: number
  role_id: number
  name: string
  email: string
  email_verified_at: Date | null
  password: string
  created_at: Date
  updated_at: Date
}

export type UserIndex = Pick<User, 'id' | 'role_id' | 'name' | 'email' | 'serial_number'> & {
  role: { id: number; name: string }
}
export type UserForm = Pick<User, 'name' | 'email' | 'password'> & {
  role_id: number | null
}
