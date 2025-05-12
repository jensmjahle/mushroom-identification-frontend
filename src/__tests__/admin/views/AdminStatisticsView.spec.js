import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import AdminStatisticsView from '@/views/admin/StatisticsView.vue'

// Mock i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key) => key })
  }
})

// Mock toast
const toastError = vi.fn()
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    error: toastError
  })
}))

// Mock API
vi.mock('@/services/rest/adminRequestService.js', () => ({
  getPaginatedRequests: vi.fn()
}))
import { getPaginatedRequests } from '@/services/rest/adminRequestService.js'

// Mock child components
vi.mock('@/components/statistics/StatsChart.vue', () => ({
  default: { template: '<div data-testid="chart">StatsChart</div>' }
}))
vi.mock('@/components/statistics/MushroomCategoryStats.vue', () => ({
  default: { template: '<div data-testid="category">MushroomCategoryStats</div>' }
}))
vi.mock('@/components/statistics/StatsOverview.vue', () => ({
  default: { template: '<div data-testid="overview">StatsOverview</div>' }
}))
vi.mock('@/components/charts/MushroomPieChart.vue', () => ({
  default: { template: '<div data-testid="pie">MushroomPieChart</div>' }
}))
vi.mock('@/components/base/BaseList.vue', () => ({
  default: {
    props: ['items', 'columns', 'pagination'],
    emits: ['next-page', 'prev-page'],
    template: `
      <div data-testid="base-list">
        <button data-testid="next" @click="$emit('next-page')">Next</button>
        <button data-testid="prev" @click="$emit('prev-page')">Prev</button>
      </div>
    `
  }
}))
vi.mock('@/components/base/rows/RequestRow.vue', () => ({
  default: {
    props: ['item'],
    template: '<div data-testid="row">RequestRow</div>'
  }
}))

describe('AdminStatisticsView.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders stats components and fetches requests on mount', async () => {
    getPaginatedRequests.mockResolvedValueOnce({
      content: [{ id: 1 }, { id: 2 }],
      totalPages: 3
    })

    const wrapper = mount(AdminStatisticsView, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    expect(getPaginatedRequests).toHaveBeenCalledWith({
      page: 0,
      status: 'NEW',
      exclude: true
    })

    expect(wrapper.find('[data-testid="chart"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="category"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="overview"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="pie"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="base-list"]').exists()).toBe(true)
  })

  it('loads next and previous pages', async () => {
    getPaginatedRequests.mockResolvedValue({ content: [], totalPages: 2 })

    const wrapper = mount(AdminStatisticsView, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    await flushPromises()

    // Trigger next page
    await wrapper.find('[data-testid="next"]').trigger('click')
    await flushPromises()
    expect(getPaginatedRequests).toHaveBeenCalledWith({ page: 1, status: 'NEW', exclude: true })

    // Trigger previous page
    await wrapper.find('[data-testid="prev"]').trigger('click')
    await flushPromises()
    expect(getPaginatedRequests).toHaveBeenCalledWith({ page: 0, status: 'NEW', exclude: true })
  })

  it('shows toast if fetch fails', async () => {
    getPaginatedRequests.mockRejectedValueOnce(new Error('fail'))

    mount(AdminStatisticsView, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()
    expect(toastError).toHaveBeenCalledWith('Failed to fetch other requests')
  })
})
