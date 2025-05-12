// src/__tests__/user/views/UserLoginView.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import UserLoginView from '@/views/user/UserLoginView.vue'

// Mock i18n with real strings
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => {
        const translations = {
          'loginUser.errorEmpty': 'Please enter your reference code.',
          'loginUser.errorInvalid': 'Invalid or expired reference code.'
        }
        return translations[key] || key
      }
    })
  }
})

// Mock loginUser and parseJwt
vi.mock('@/services/rest/authService.js', () => ({
  loginUser: vi.fn((code) => {
    if (code === 'INVALID') {
      const err = new Error('Invalid code')
      err.suppressLogging = true
      return Promise.reject(err)
    }
    return Promise.resolve({ data: { token: 'mock.jwt.token' } })
  })
}))
vi.mock('@/utils/jwt.js', () => ({
  parseJwt: () => ({ sub: 'mock-user-id' })
}))

describe('UserLoginView.vue', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/request/:userRequestId', name: 'user-request', component: { template: '<div>Chat</div>' } }
      ]
    })
    await router.push('/')
    await router.isReady()

    vi.stubGlobal('sessionStorage', { setItem: vi.fn() })
    vi.spyOn(window, 'dispatchEvent')
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('renders and handles login with valid input', async () => {
    const wrapper = mount(UserLoginView, {
      global: {
        plugins: [router]
      }
    })

    const input = wrapper.find('#ref-code')
    await input.setValue('VALIDCODE123')

    const button = wrapper.find('button')
    await button.trigger('submit')
    await flushPromises()

    expect(sessionStorage.setItem).toHaveBeenCalledWith('jwt', 'mock.jwt.token')
    expect(window.dispatchEvent).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('user-request')
    expect(router.currentRoute.value.params.userRequestId).toBe('mock-user-id')
  })

  it('shows error if submitted with invalid input', async () => {
    const wrapper = mount(UserLoginView, {
      global: {
        plugins: [router]
      }
    })

    const input = wrapper.find('#ref-code')
    await input.setValue('INVALID')

    const button = wrapper.find('button')
    await button.trigger('submit')
    await flushPromises()

    const errorElement = wrapper.find('p.text-danger')
    expect(wrapper.html()).toContain('Invalid or expired reference code.')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toBe('Invalid or expired reference code.')
  })
})