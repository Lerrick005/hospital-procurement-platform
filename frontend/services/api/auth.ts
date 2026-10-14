import api from './client'
import { LoginCredentials, LoginResponse, AuthUser } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  removeToken(): void {
    localStorage.removeItem('auth_token')
    delete api.defaults.headers.common['Authorization']
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
