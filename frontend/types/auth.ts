export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  hospital?: string
  avatar?: string
  permissions: string[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RegisterData {
  name: string
  email: string
  password: string
  hospital: string
  role: string
}
