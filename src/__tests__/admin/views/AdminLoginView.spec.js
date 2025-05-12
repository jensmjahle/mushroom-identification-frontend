import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import AdminLoginView from '@/views/admin/AdminLoginView.vue'

// Mock i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key
    })
  }
})

// Mock loginAdmin
vi.mock('@/services/rest/authService', () => ({
  loginAdmin: vi.fn()
}))

import { loginAdmin } from '@/services/rest/authService'

describe('AdminLoginView.vue', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/admin/dashboard', name: 'admin-dashboard', component: { template: '<div>Dashboard</div>' } }
      ]
    })
    await router.push('/')
    await router.isReady()

    vi.stubGlobal('sessionStorage', {
      setItem: vi.fn()
    })
    vi.spyOn(console, 'error').mockImplementation(() => {}) // suppress error log
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('calls loginAdmin and navigates to admin dashboard on success', async () => {
    loginAdmin.mockResolvedValueOnce({ data: { token: 'mock-admin-token' } })

    const wrapper = mount(AdminLoginView, {
      global: {
        plugins: [router]
      }
    })

    const form = wrapper.findComponent({ name: 'AdminLoginForm' })
    await form.props('onLogin')('admin', 'password123')
    await flushPromises()

    expect(loginAdmin).toHaveBeenCalledWith('admin', 'password123')
    expect(sessionStorage.setItem).toHaveBeenCalledWith('jwt', 'mock-admin-token')
    expect(router.currentRoute.value.name).toBe('admin-dashboard')
  })

  it('throws and logs error if login fails', async () => {
    loginAdmin.mockRejectedValueOnce(new Error('Login failed'))

    const wrapper = mount(AdminLoginView, {
      global: {
        plugins: [router]
      }
    })

    const form = wrapper.findComponent({ name: 'AdminLoginForm' })

    await expect(form.props('onLogin')('admin', 'wrongpass')).rejects.toThrow('Login failed')
    expect(router.currentRoute.value.name).toBe('home')
    expect(sessionStorage.setItem).not.toHaveBeenCalled()
  })
})
