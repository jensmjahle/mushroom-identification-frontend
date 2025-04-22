import axios from 'axios'
import { useToast } from 'vue-toastification'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

const toast = useToast()

api.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status
      const currentRoute = router.currentRoute.value
      const isAdmin = currentRoute.path.startsWith('/admin')

      switch (status) {
        case 401:
          toast.error('Session expired. Please log in again.')
          sessionStorage.removeItem('jwt')
          router.push({ name: isAdmin ? 'admin-login' : 'home' })
          break

        case 403:
          toast.warning('You do not have permission to access this.')
          break

        case 404:
          toast.error('The requested resource was not found.')
          break

        default:
          if (status >= 500) {
            toast.error('Server error occurred. Please try again later.')
          }
      }

      return Promise.reject(error)
    }
)

export default api
