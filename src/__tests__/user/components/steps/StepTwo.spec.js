// src/__tests__/user/components/steps/StepTwo.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import StepTwo from '@/components/user/steps/StepTwo.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Mock vue-i18n so t() returns the key
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: (key) => key
    })
  }
})

// Mock loginUser and parseJwt (used by the merged "go to chat" action)
vi.mock('@/services/rest/authService.js', () => ({
  loginUser: vi.fn(() =>
    Promise.resolve({ data: { token: 'mock.jwt.token' } })
  )
}))
vi.mock('@/utils/jwt.js', () => ({
  parseJwt: () => ({ sub: 'mock-user-id' })
}))

// getOnlineAdminCount is called on mount; stub it so tests don't depend on
// the real websocket service
vi.mock('@/services/rest/websocketService.js', () => ({
  getOnlineAdminCount: vi.fn(() => Promise.resolve(0))
}))

describe('StepTwo.vue', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/submit', name: 'submit-request', component: StepTwo, props: true },
        { path: '/request/:userRequestId', name: 'user-request', component: { template: '<div>Chat</div>' } }
      ]
    })
    await router.push('/submit')
    await router.isReady()

    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn() }
    })
    vi.stubGlobal('sessionStorage', {
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getItem: vi.fn()
    })
    vi.spyOn(window, 'dispatchEvent')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  const mountStepTwo = () => {
    const App = { template: '<router-view />' }
    return mount(App, {
      global: {
        plugins: [router],
        components: { BaseButton }
      },
      props: { referenceCode: 'ABC123' }
    })
  }

  it('displays and copies the reference code', async () => {
    const wrapper = mountStepTwo()
    await flushPromises()
    const stepWrapper = wrapper.findComponent(StepTwo)

    expect(stepWrapper.text()).toContain('ABC123')

    await stepWrapper.find('[data-testid="copy-button"]').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABC123')
  })

  it('goes straight to chat on one click, with no extra confirmation step', async () => {
    const wrapper = mountStepTwo()
    await flushPromises()
    const stepWrapper = wrapper.findComponent(StepTwo)

    // No confirmation modal should appear just from being on the page
    expect(stepWrapper.find('[data-testid="ready-modal"]').exists()).toBe(false)

    await stepWrapper.find('[data-testid="chat-button"]').trigger('click')
    await flushPromises()

    // Still no confirmation modal - the click itself is the confirmation
    expect(stepWrapper.find('[data-testid="ready-modal"]').exists()).toBe(false)

    expect(sessionStorage.setItem).toHaveBeenCalledWith('jwt', 'mock.jwt.token')
    expect(window.dispatchEvent).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('user-request')
    expect(router.currentRoute.value.params.userRequestId).toBe('mock-user-id')
  })

  it('navigates home on one click, with no extra confirmation step', async () => {
    const wrapper = mountStepTwo()
    await flushPromises()
    const stepWrapper = wrapper.findComponent(StepTwo)

    await stepWrapper.find('[data-testid="home-button"]').trigger('click')
    await flushPromises()

    expect(stepWrapper.find('[data-testid="ready-modal"]').exists()).toBe(false)
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('still warns before an unrelated/accidental navigation away', async () => {
    const wrapper = mountStepTwo()
    await flushPromises()
    const stepWrapper = wrapper.findComponent(StepTwo)

    // Simulate an accidental navigation (e.g. browser back, a sidebar link)
    // rather than clicking Chat/Home
    router.push('/')
    await flushPromises()

    expect(stepWrapper.find('[data-testid="ready-modal"]').exists()).toBe(true)

    await stepWrapper.find('[data-testid="cancel-button"]').trigger('click')
    await flushPromises()
    expect(stepWrapper.find('[data-testid="ready-modal"]').exists()).toBe(false)
    expect(router.currentRoute.value.name).toBe('submit-request')
  })
})
