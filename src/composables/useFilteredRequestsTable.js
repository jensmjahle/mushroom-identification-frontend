import { ref, computed, watch } from 'vue'
import { getPaginatedRequests, releaseRequestAsSuperuser } from '@/services/rest/adminRequestService.js'
import { getMushroomDecisionInfo } from '@/utils/formatters.js'
import { useToast } from 'vue-toastification'

function currentYearBounds() {
  const year = new Date().getFullYear()
  return {
    from: `${year}-01-01`,
    to: `${year}-12-31`
  }
}

function compareValues(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

// mushroomDecision has no single backing field to sort by - it's a derived
// summary of mushroomStatusCounts, so it needs its own sort value: items with
// no decision yet sort first, then grouped by dominant status, largest first.
function decisionSortValue(item) {
  const info = getMushroomDecisionInfo(item.mushroomStatusCounts)
  if (!info) return ''
  return `${info.dominantStatus}:${String(info.dominantCount).padStart(10, '0')}`
}

function sortValueFor(item, key) {
  return key === 'mushroomDecision' ? decisionSortValue(item) : item[key]
}

/**
 * Shared date-filter/fetch/sort state for the admin request tables (All requests,
 * Statistics). Fetches every matching request in one unpaged call rather than
 * paginating, refetched whenever the status or date filters change. Sorting is
 * done client-side over the fetched set, since one of the sortable columns
 * (mushroom count) isn't a real column on the backend entity.
 *
 * @param status a ref holding the status to filter by, or null for no status filter
 * @param exclude a ref holding whether `status` should be excluded instead of required
 * @returns reactive table state and controls
 */
export function useFilteredRequestsTable({ status = ref(null), exclude = ref(false) } = {}) {
  const toast = useToast()
  const { from: defaultFrom, to: defaultTo } = currentYearBounds()

  const rawItems = ref([])
  const loading = ref(false)
  const dateFrom = ref(defaultFrom)
  const dateTo = ref(defaultTo)
  const sortKey = ref('updatedAt')
  const sortDirection = ref('desc')

  const fetchItems = async () => {
    loading.value = true
    try {
      const res = await getPaginatedRequests({
        status: status.value,
        exclude: exclude.value,
        from: dateFrom.value || null,
        to: dateTo.value || null,
        unpaged: true
      })
      rawItems.value = res.content
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Error fetching requests')
    } finally {
      loading.value = false
    }
  }

  const items = computed(() => {
    const sorted = [...rawItems.value]
    sorted.sort((a, b) => {
      const result = compareValues(sortValueFor(a, sortKey.value), sortValueFor(b, sortKey.value))
      return sortDirection.value === 'asc' ? result : -result
    })
    return sorted
  })

  const toggleSort = (key) => {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDirection.value = 'asc'
    }
  }

  const releaseRequest = async (userRequestId) => {
    const result = await releaseRequestAsSuperuser(userRequestId)
    if (result !== null) await fetchItems()
  }

  watch([status, exclude, dateFrom, dateTo], fetchItems)

  return { items, loading, dateFrom, dateTo, sortKey, sortDirection, fetchItems, toggleSort, releaseRequest }
}
