import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAdminBroadcastStore } from '@/store/useAdminBroadcastStore.js'

describe('useAdminBroadcastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('records the broadcast type and increments the counter each time', () => {
    const store = useAdminBroadcastStore()
    expect(store.broadcastCounter).toBe(0)

    store.recordBroadcast('NEW_REQUEST_IN_QUEUE')
    expect(store.lastBroadcastType).toBe('NEW_REQUEST_IN_QUEUE')
    expect(store.broadcastCounter).toBe(1)

    store.recordBroadcast('STATUS_CHANGED')
    expect(store.lastBroadcastType).toBe('STATUS_CHANGED')
    expect(store.broadcastCounter).toBe(2)
  })
})
