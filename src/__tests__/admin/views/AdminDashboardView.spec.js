import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import BaseButton from '@/components/base/BaseButton.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key, params) => {
        if (key === 'admin.adminDashboard.greeting') return `Hi ${params.name}`
        if (key === 'admin.adminDashboard.buttons.allRequests') return `All requests (${params.count})`
        return key
      }
    })
  }
})

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
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders greeting and tips', async () => {
    getPaginatedNewRequests.mockResolvedValueOnce({ content: [{}, {}, {}] })

    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    expect(wrapper.text()).toContain('Hi MockAdmin')
    expect(wrapper.text()).toContain('admin.adminDashboard.tips.tip1')
    expect(wrapper.text()).toContain('All requests (3)')
  })

  it('navigates to statistics on button click', async () => {
    getPaginatedNewRequests.mockResolvedValueOnce({ content: [] })

    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    const buttons = wrapper.findAllComponents(BaseButton)
    await buttons[2].trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('admin-statistics')
  })

  it('calls getNextRequestFromQueue and navigates when request is found', async () => {
    getPaginatedNewRequests.mockResolvedValueOnce({ content: [] })
    getNextRequestFromQueue.mockResolvedValueOnce({ userRequestId: 'abc123' })

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

    expect(router.currentRoute.value.name).toBe('admin-request')
    expect(router.currentRoute.value.params.userRequestId).toBe('abc123')
  })

  it('shows toast if no request in queue', async () => {
    getPaginatedNewRequests.mockResolvedValueOnce({ content: [] })
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
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    getPaginatedNewRequests.mockResolvedValueOnce({ content: [] })
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
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('handles empty list of new requests without crashing', async () => {
    getPaginatedNewRequests.mockResolvedValueOnce({ content: [] })

    const wrapper = mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()
    expect(wrapper.text()).toContain('All requests (0)')
  })

  it('logs error if getPaginatedNewRequests throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    getPaginatedNewRequests.mockRejectedValueOnce(new Error('Simulated fetch error'))

    mount(AdminDashboardView, {
      global: {
        plugins: [router],
        components: { BaseButton }
      }
    })

    await flushPromises()

    expect(errorSpy).toHaveBeenCalledWith('Feil ved henting av forespørsler', expect.any(Error))
    errorSpy.mockRestore()
  })
})
