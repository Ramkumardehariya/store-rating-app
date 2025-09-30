// src/services/authService.js
import api from './api'

export const authService = {
  setToken(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  removeToken() {
    delete api.defaults.headers.common['Authorization']
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async updatePassword(passwordData) {
    const response = await api.put('/auth/update-password', passwordData)
    return response.data
  }
}