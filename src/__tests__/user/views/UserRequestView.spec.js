// src/__tests__/user/views/UserRequestView.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import no from '@/locales/no.json'
import UserRequestView from '@/views/user/UserRequestView.vue'
import { getUserRequest } from '@/services/rest/userRequestService.js'

// Mock service
vi.mock('@/services/rest/userRequestService.js', () => ({
  getUserRequest: vi.fn(() => Promise.resolve({ id: 'mock-id', status: 'new' }))
}))

// Mock subcomponents
vi.mock('@/components/ChatBox.vue', () => ({
  default: {
    name: 'ChatBox',
    template: '<div>MockChatBox</div>'
  }
}))
vi.mock('@/components/MushroomBasket.vue', () => ({
  default: {
    name: 'MushroomBasket',
    emits: ['basket-toggle', 'updated'],
    template: '<div>MockMushroomBasket</div>'
  }
}))
vi.mock('@/components/RequestStatusBox.vue', () => ({
  default: {
    name: 'RequestStatusBox',
    props: ['request'],
    template: '<div>MockRequestStatusBox</div>'
  }
}))
vi.mock('@/components/StepIndicator.vue', () => ({
  default: {
    name: 'StepIndicator',
    template: '<div>MockStepIndicator</div>'
  }
}))
vi.mock('@/components/layout/UserDisplayCard.vue', () => ({
  default: {
    name: 'UserDisplayCard',
    template: '<div><slot /></div>'
  }
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en, no }
})

describe('UserRequestView.vue', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/request/:userRequestId',
          name: 'user-request',
          component: UserRequestView
        }
      ]
    })

    await router.push('/request/mock-id')
    await router.isReady()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = async () => {
    return mount(UserRequestView, {
      global: {
        plugins: [router, createTestingPinia({ stubActions: false }), i18n]
      }
    })
  }

  it('renders child components and fetches request', async () => {
    const wrapper = await createWrapper()
    await flushPromises()

    expect(getUserRequest).toHaveBeenCalledTimes(1)
    expect(wrapper.html()).toContain('MockChatBox')
    expect(wrapper.html()).toContain('MockRequestStatusBox')
  })

  it('toggles basket and reloads request on update event', async () => {
    const wrapper = await createWrapper()
    await flushPromises()

    const basket = wrapper.findComponent({ name: 'MushroomBasket' })
    await basket.vm.$emit('basket-toggle', true)
    await basket.vm.$emit('updated')
    await basket.vm.$emit('updated')

    expect(getUserRequest).toHaveBeenCalledTimes(3)
  })

  it('adjusts layout when isMobile is true', async () => {
    global.innerWidth = 500
    global.dispatchEvent(new Event('resize'))

    const wrapper = await createWrapper()
    await flushPromises()

    expect(wrapper.html()).toContain('MockChatBox')
  })

  it('removes resize event listener on unmount', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const wrapper = await createWrapper()
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
