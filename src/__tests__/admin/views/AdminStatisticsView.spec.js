import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
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
    props: ['items', 'columns', 'sortKey', 'sortDirection'],
    emits: ['sort-change'],
    template: `
      <div data-testid="base-list">
        <button data-testid="sort-updatedAt" @click="$emit('sort-change', 'updatedAt')">Sort</button>
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

const currentYearBounds = () => {
  const year = new Date().getFullYear()
  return { from: `${year}-01-01`, to: `${year}-12-31` }
}

describe('AdminStatisticsView.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders stats components and fetches all matching requests on mount', async () => {
    getPaginatedRequests.mockResolvedValueOnce({
      content: [{ id: 1 }, { id: 2 }]
    })

    const wrapper = mount(AdminStatisticsView, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    const { from, to } = currentYearBounds()
    expect(getPaginatedRequests).toHaveBeenCalledWith({
      status: 'NEW',
      exclude: true,
      from,
      to,
      unpaged: true
    })

    expect(wrapper.find('[data-testid="chart"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="category"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="overview"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="pie"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="base-list"]').exists()).toBe(true)
  })

  it('refetches when the date filter changes', async () => {
    getPaginatedRequests.mockResolvedValue({ content: [] })

    const wrapper = mount(AdminStatisticsView, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    await flushPromises()
    getPaginatedRequests.mockClear()

    await wrapper.find('input[type="date"]').setValue('2020-01-01')
    await flushPromises()

    expect(getPaginatedRequests).toHaveBeenCalledWith(
      expect.objectContaining({ from: '2020-01-01' })
    )
  })

  it('shows toast if fetch fails', async () => {
    getPaginatedRequests.mockRejectedValueOnce(new Error('fail'))

    mount(AdminStatisticsView, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()
    expect(toastError).toHaveBeenCalledWith('Error fetching requests')
  })
})
