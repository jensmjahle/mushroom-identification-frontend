import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Mock i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key, params) => (params?.count !== undefined ? `${key} (${params.count})` : key)
    })
  }
})

// Mock jwt and toast
vi.mock('@/utils/jwt.js', () => ({
  parseJwt: () => ({ sub: 'MockAdmin' })
}))
const toastInfo = vi.fn()
const toastError = vi.fn()
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    info: toastInfo,
    error: toastError
  })
}))

// Mock adminRequestService
vi.mock('@/services/adminRequestService.js', () => ({
  getNextRequestFromQueue: vi.fn(),
  getPaginatedNewRequests: vi.fn()
}))

import { getNextRequestFromQueue, getPaginatedNewRequests } from '@/services/adminRequestService.js'

describe('AdminDashboardView.vue', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/admin/statistics', name: 'admin-statistics', component: { template: '<div>Stats</div>' } },
        { path: '/admin/requests', name: 'admin-all-requests', component: { template: '<div>All Requests</div>' } },
        { path: '/admin/request/:userRequestId', name: 'admin-request', component: { template: '<div>Request</div>' } }
      ]
    })
    await router.push('/')
    await router.isReady()

    // Simulate 3 new requests
    getPaginatedNewRequests.mockResolvedValueOnce({ content: [{}, {}, {}] })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders greeting and tips', async () => {
    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    expect(wrapper.text()).toContain('admin.adminDashboard.greeting')
    expect(wrapper.text()).toContain('admin.adminDashboard.tips.tip1')
    expect(wrapper.text()).toContain('admin.adminDashboard.buttons.allRequests')
  })

  it('navigates to statistics on button click', async () => {
    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    const buttons = wrapper.findAllComponents(BaseButton)
    await buttons[2].trigger('click') // statistics button
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('calls getNextRequestFromQueue and navigates when request is found', async () => {
    getNextRequestFromQueue.mockResolvedValueOnce({ userRequestId: 'abc123' })

    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    const buttons = wrapper.findAllComponents(BaseButton)
    await buttons[1].trigger('click') // Next in queue
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('admin-request')
    expect(router.currentRoute.value.params.userRequestId).toBe('abc123')
  })

  it('shows toast if no request in queue', async () => {
    getNextRequestFromQueue.mockResolvedValueOnce(null)

    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    const buttons = wrapper.findAllComponents(BaseButton)
    await buttons[1].trigger('click')
    await flushPromises()

    expect(toastInfo).toHaveBeenCalledWith('Ingen forespørsler i køen')
  })

  it('shows error toast if getNextRequestFromQueue throws', async () => {
    getNextRequestFromQueue.mockRejectedValueOnce(new Error('API down'))

    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    const buttons = wrapper.findAllComponents(BaseButton)
    await buttons[1].trigger('click')
    await flushPromises()

    expect(toastError).toHaveBeenCalledWith('Kunne ikke hente neste forespørsel fra kø')
  })
})
