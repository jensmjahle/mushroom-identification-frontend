import axios from 'axios'
import { useToast } from 'vue-toastification'
import router from '@/router/index.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mushroom-identification-backend-954531306961.us-central1.run.app',
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

      const data = error.response?.data || {}
      const message = data.message || 'An error occurred.'
      const type = data.type || null

      switch (status) {
        case 401:
          if (type === 'INVALID_TOKEN') {
            toast.error(message || 'Session expired. Please log in again.')
            sessionStorage.removeItem('jwt')
            router.push({ name: isAdmin ? 'admin-login' : 'home' })
          } else {
            toast.error(message || 'Unauthorized. Please check your credentials.')
          }
          break

        case 403:
          toast.warning(message || 'You do not have permission to access this.')
          break

        case 404:
          toast.error(message || 'The requested resource was not found.')
          break

        default:
          if (status >= 500) {
            toast.error(message || 'Server error occurred. Please try again later.')
            console.error('Server error:', error)
          } else if (message) {
            toast.error(message)
          }
      }

      return Promise.reject(error)
    }
)

export default api
