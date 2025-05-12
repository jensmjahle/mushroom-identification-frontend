// src/__tests__/user/views/UserRequestView.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import UserRequestView from '@/views/user/UserRequestView.vue'
import { getUserRequest } from '@/services/userRequestService.js'

// Mock actual service
vi.mock('@/services/userRequestService.js', () => ({
  getUserRequest: vi.fn(() => Promise.resolve({ id: 'mock-id', status: 'new' }))
}))

// Mock ChatBox and MushroomBasket to suppress errors and WebSocket
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

  it('renders child components and fetches request', async () => {
    const wrapper = mount(UserRequestView, {
      global: { plugins: [router] }
    })

    await flushPromises()
    expect(getUserRequest).toHaveBeenCalledTimes(1)
    expect(wrapper.html()).toContain('MockChatBox')
    expect(wrapper.html()).toContain('MockRequestStatusBox')
  })

  it('toggles basket and reloads request on update event', async () => {
    const wrapper = mount(UserRequestView, {
      global: { plugins: [router] }
    })

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

    const wrapper = mount(UserRequestView, {
      global: { plugins: [router] }
    })

    await flushPromises()
    expect(wrapper.html()).toContain('MockChatBox')
  })

  it('removes resize event listener on unmount', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const wrapper = mount(UserRequestView, {
      global: { plugins: [router] }
    })

    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
