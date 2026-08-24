import { ref, nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFilteredRequestsTable } from '@/composables/useFilteredRequestsTable.js'

vi.mock('vue-toastification', () => ({
  useToast: () => ({ error: vi.fn() })
}))

vi.mock('@/services/rest/adminRequestService.js', () => ({
  getPaginatedRequests: vi.fn(),
  releaseRequestAsSuperuser: vi.fn()
}))
import { getPaginatedRequests, releaseRequestAsSuperuser } from '@/services/rest/adminRequestService.js'

describe('useFilteredRequestsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sorts by mushroomDecision: undecided first, then grouped by dominant status/count', async () => {
    getPaginatedRequests.mockResolvedValue({
      content: [
        { userRequestId: 'a', mushroomStatusCounts: { PSILOCYBIN: 1, TOXIC: 3 } }, // TOXIC dominant, 3
        { userRequestId: 'b', mushroomStatusCounts: { NOT_PROCESSED: 2 } },        // no decision
        { userRequestId: 'c', mushroomStatusCounts: { PSILOCYBIN: 5 } }            // PSILOCYBIN dominant, 5
      ]
    })

    const table = useFilteredRequestsTable()
    await table.fetchItems()
    table.toggleSort('mushroomDecision') // ascending

    expect(table.items.value.map(i => i.userRequestId)).toEqual(['b', 'c', 'a'])
  })

  it('sorts by owner (username), grouping unassigned requests first', async () => {
    getPaginatedRequests.mockResolvedValue({
      content: [
        { userRequestId: 'a', username: 'zoe' },
        { userRequestId: 'b', username: null },
        { userRequestId: 'c', username: 'alice' }
      ]
    })

    const table = useFilteredRequestsTable()
    await table.fetchItems()
    table.toggleSort('username') // ascending

    expect(table.items.value.map(i => i.userRequestId)).toEqual(['b', 'c', 'a'])
  })

  it('toggleSort flips direction on repeated clicks of the same column', async () => {
    getPaginatedRequests.mockResolvedValue({
      content: [{ userRequestId: 'a' }, { userRequestId: 'b' }]
    })
    const table = useFilteredRequestsTable()
    await table.fetchItems()

    table.toggleSort('userRequestId')
    expect(table.sortDirection.value).toBe('asc')
    expect(table.items.value.map(i => i.userRequestId)).toEqual(['a', 'b'])

    table.toggleSort('userRequestId')
    expect(table.sortDirection.value).toBe('desc')
    expect(table.items.value.map(i => i.userRequestId)).toEqual(['b', 'a'])
  })

  it('refetches when the status or date filter refs change', async () => {
    getPaginatedRequests.mockResolvedValue({ content: [] })
    const status = ref('NEW')
    const exclude = ref(false)
    useFilteredRequestsTable({ status, exclude })
    await nextTick()
    getPaginatedRequests.mockClear()

    status.value = 'COMPLETED'
    await nextTick()

    expect(getPaginatedRequests).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'COMPLETED' })
    )
  })

  it('releaseRequest calls the API and refetches on success', async () => {
    getPaginatedRequests.mockResolvedValue({ content: [] })
    releaseRequestAsSuperuser.mockResolvedValue('released')
    const table = useFilteredRequestsTable()
    await table.fetchItems()
    getPaginatedRequests.mockClear()

    await table.releaseRequest('req1')

    expect(releaseRequestAsSuperuser).toHaveBeenCalledWith('req1')
    expect(getPaginatedRequests).toHaveBeenCalled()
  })

  it('releaseRequest does not refetch if the API call failed', async () => {
    getPaginatedRequests.mockResolvedValue({ content: [] })
    releaseRequestAsSuperuser.mockResolvedValue(null)
    const table = useFilteredRequestsTable()
    await table.fetchItems()
    getPaginatedRequests.mockClear()

    await table.releaseRequest('req1')

    expect(getPaginatedRequests).not.toHaveBeenCalled()
  })
})
