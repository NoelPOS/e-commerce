import { create } from 'zustand'

import axiosInstance from '../lib/axio'
import { toast } from 'react-hot-toast'

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true })

    if (password !== confirmPassword) {
      set({ loading: false })
      return toast.error('Passwords do not match')
    }

    try {
      const res = await axiosInstance.post('/auth/signup', {
        name,
        email,
        password,
      })
      set({ user: res.data, loading: false })
    } catch (error) {
      toast.error(error.response.data.message || 'An error occured')
      set({ loading: false })
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true })

    try {
      const res = await axiosInstance.post('/auth/login', { email, password })

      set({ user: res.data, loading: false })
    } catch (error) {
      toast.error(error.response.data.message || 'An error occured')
      set({ loading: false })
    }
  },
  logout: async () => {
    set({ loading: true })

    try {
      await axiosInstance.post('/auth/logout')
      set({ user: null, loading: false })
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error(error.response.data.message || 'An error occured')
      set({ loading: false })
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true })

    try {
      const res = await axiosInstance.get('/auth/profile')
      set({ user: res.data, checkingAuth: false })
    } catch (error) {
      toast.error(error.response.data.message || 'An error occured')
      set({ checkingAuth: false })
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return // Do not refresh token if already checking auth

    set({ checkingAuth: true })

    try {
      const res = await axiosInstance.post('/auth/refreshtoken')
      set({ checkingAuth: false })
      return res.data
    } catch (error) {
      toast.error(
        error.response.data.message || 'An error occured while refreshing token'
      )
      set({ user: null, checkingAuth: false })
    }
  },
}))

let refreshPromise = null

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (refreshPromise) {
          await refreshPromise
          return axiosInstance(originalRequest)
        }

        refreshPromise = useUserStore.getState().refreshToken()
        await refreshPromise
        refreshPromise = null

        return axiosInstance(originalRequest)
      } catch (refresherror) {
        useUserStore.getState().logout()
        return Promise.reject(refresherror)
      }
    }

    return Promise.reject(error)
  }
)
