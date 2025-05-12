import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import AdminUserRequestView from '@/views/admin/AdminUserRequestView.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Mock i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

// Mock services
vi.mock('@/services/rest/adminRequestService.js', () => ({
  getUserRequestAdmin: vi.fn()
}))
import { getUserRequestAdmin } from '@/services/rest/adminRequestService.js'

// Mock child components
vi.mock('@/components/ChatBox.vue', () => ({
  default: {
    name: 'ChatBox',
    props: ['userRequestId'],
    template: '<div data-testid="chatbox">ChatBox</div>'
  }
}))
vi.mock('@/components/RequestStatusBox.vue', () => ({
  default: {
    name: 'RequestStatusBox',
    props: ['request'],
    template: '<div data-testid="request-status">RequestStatusBox</div>'
  }
}))
vi.mock('@/components/MushroomBasket.vue', () => ({
  default: {
    name: 'MushroomBasket',
    props: ['userRequestId'],
    emits: ['basket-toggle', 'updated'],
    template: `
      <div data-testid="basket">
        MushroomBasket
        <button data-testid="toggle-basket" @click="$emit('basket-toggle', true)">Toggle</button>
        <button data-testid="update-basket" @click="$emit('updated')">Update</button>
      </div>
    `
  }
}))

describe('AdminUserRequestView.vue', () => {
  let router

  beforeEach(async () => {
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {})
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {})
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 }) // mobile

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/admin/request/:userRequestId', name: 'admin-request', component: AdminUserRequestView }
      ]
    })

    await router.push('/admin/request/test123')
    await router.isReady()

    getUserRequestAdmin.mockResolvedValue({ id: 'test123', status: 'pending' })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('renders userRequest and subcomponents when loaded', async () => {
    const wrapper = mount(AdminUserRequestView, {
      global: {
        plugins: [router, createTestingPinia()]
      }
    })

    await flushPromises()

    expect(getUserRequestAdmin).toHaveBeenCalledWith('test123')
    expect(wrapper.find('[data-testid="chatbox"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="request-status"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="basket"]').exists()).toBe(true)
  })

  it('toggles basket open on mobile and shows/hides blur overlay', async () => {
    const wrapper = mount(AdminUserRequestView, {
      global: {
        plugins: [router, createTestingPinia()]
      }
    })

    await flushPromises()
    expect(wrapper.find('.backdrop-blur-md').exists()).toBe(false)

    // Open basket (mobile)
    await wrapper.find('[data-testid="toggle-basket"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('.backdrop-blur-md').exists()).toBe(true)

    // Click blur overlay to close
    await wrapper.find('.backdrop-blur-md').trigger('click')
    await flushPromises()
    expect(wrapper.find('.backdrop-blur-md').exists()).toBe(false)
  })

  it('calls reloadUserRequest when basket emits updated', async () => {
    getUserRequestAdmin.mockResolvedValueOnce({ id: 'test123', status: 'pending' }) // for reload
    const wrapper = mount(AdminUserRequestView, {
      global: {
        plugins: [router, createTestingPinia()]
      }
    })

    await flushPromises()
    await wrapper.find('[data-testid="update-basket"]').trigger('click')
    await flushPromises()

    expect(getUserRequestAdmin).toHaveBeenCalledTimes(2)
  })

  it('does NOT show blur overlay on desktop when basket is toggled', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true }) // desktop
    const wrapper = mount(AdminUserRequestView, {
      global: {
        plugins: [router, createTestingPinia()]
      }
    })

    await flushPromises()
    await wrapper.find('[data-testid="toggle-basket"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('.backdrop-blur-md').exists()).toBe(false)
  })
})
