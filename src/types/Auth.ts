export interface AuthUser {
  id: number
  name: string
  email: string
  role_id: number
  // Add other user properties as needed
}

export interface LoginPayload {
  email: string
  password: string
  device_name: string
}
