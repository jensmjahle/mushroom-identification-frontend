// src/__tests__/user/components/steps/StepThree.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import StepThree from '@/components/user/steps/StepThree.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Mock vue-i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

// Mock loginUser and parseJwt
vi.mock('@/services/authService.js', () => ({
  loginUser: vi.fn(() =>
    Promise.resolve({ data: { token: 'mock.jwt.token' } })
  )
}))
vi.mock('@/utils/jwt.js', () => ({
  parseJwt: () => ({ sub: 'mock-user-id' })
}))

describe('StepThree.vue', () => {
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

    vi.stubGlobal('sessionStorage', {
      setItem: vi.fn()
    })
    vi.spyOn(window, 'dispatchEvent')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('renders thank you content and navigates to chat', async () => {
    const wrapper = mount(StepThree, {
      global: {
        plugins: [router],
        components: { BaseButton }
      },
      props: {
        referenceCode: 'TESTCODE123'
      }
    })

    await wrapper.find('[data-testid="chat-button"]').trigger('click')
    await flushPromises()

    expect(sessionStorage.setItem).toHaveBeenCalledWith('jwt', 'mock.jwt.token')
    expect(window.dispatchEvent).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('user-request')
    expect(router.currentRoute.value.params.userRequestId).toBe('mock-user-id')
  })

  it('emits finish when home button is clicked', async () => {
    const wrapper = mount(StepThree, {
      global: {
        plugins: [router],
        components: { BaseButton }
      },
      props: {
        referenceCode: 'TESTCODE123'
      }
    })

    await wrapper.find('[data-testid="home-button"]').trigger('click')
    expect(wrapper.emitted('finish')).toBeTruthy()
  })
})