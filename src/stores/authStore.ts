import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import api from '@/plugins/axios'
import type { AuthUser, LoginPayload } from '@/types/Auth'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const layout = ref('')

  const isAuthenticated = computed(() => {
    return user.value ? true : false
  })

  async function getUser() {
    const localToken = localStorage.getItem('token')
    if (!localToken) return false
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${localToken}`
      const response = await api.get(`/api/users/me`)
      token.value = localToken
      user.value = response.data
    } catch (error) {
      console.log(error)
      logout()
    }
  }
  async function login(data: LoginPayload) {
    try {
      const url = `/api/auth/login`

      const response = await api.post(url, data)

      token.value = response.data.data.token
      localStorage.setItem('token', token.value!)
      await getUser()
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  async function register(formBody: object) {
    try {
      const url = `/api/auth/register`
      const response = await api.post(url, formBody)

      token.value = response.data.data.token
      // console.log(token.value)

      localStorage.setItem('token', token.value!)
      await getUser()
    } catch (error) {
      console.log(error)
    }
  }
  function logout() {
    localStorage.removeItem('token')
    user.value = null
    token.value = null
    api.defaults.headers.common['Authorization'] = null
  }

  return {
    user,
    token,
    layout,
    isAuthenticated,
    getUser,
    login,
    register,
    logout,
  }
})
