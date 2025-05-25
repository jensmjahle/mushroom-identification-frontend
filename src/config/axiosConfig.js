import axios from 'axios'
import { useToast } from 'vue-toastification'
import router from '@/router/index.js'
import i18n from '@/locales/i18n'

const api = axios.create({
  baseURL: window.env?.VITE_API_URL || 'http://localhost:8080',
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
      const t = i18n.global.t
      const data = error.response?.data || {}
      const message = data.message || t('errors.GENERIC')
      const type = data.type || null

    switch (status) {
      case 401:
        if (type === 'INVALID_TOKEN') {
          toast.error(message || t('errors.INVALID_TOKEN'))
          sessionStorage.removeItem('jwt')
          router.push({ name: isAdmin ? 'admin-login' : 'home' })
        } else {
          toast.error(message || t('errors.UNAUTHORIZED'))
        }
        break

      case 403:
        toast.warning(message || t('errors.FORBIDDEN'))
        break

      case 404:
        toast.error(message || t('errors.NOT_FOUND'))
        break

      default:
        if (status >= 500) {
          toast.error(message || t('errors.INTERNAL_SERVER_ERROR'))
          console.error('Server error:', error)
        } else if (message) {
            toast.error(message)
          }
      }

      return Promise.reject(error)
    }
)

export default api
