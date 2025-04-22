import axios from '@/config/axiosConfig'

export const loginAdmin = (username, password) => {
  return axios.post('/auth/admin/login', { username, password })
}

export const loginUser = (referenceCode) => {
  return axios.post('/auth/user/login', { referenceCode })
}
