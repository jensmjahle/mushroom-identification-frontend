import { defineStore } from 'pinia'

/**
 * Holds the latest admin-wide WebSocket broadcast (e.g. "a new request was
 * added to the queue"). AppAdminLayout owns the single global socket
 * connection for the whole admin section and records broadcasts here;
 * individual views (All requests, Statistics) watch this store to know when
 * to refetch instead of requiring a manual page refresh.
 */
export const useAdminBroadcastStore = defineStore('adminBroadcast', {
  state: () => ({
    lastBroadcastType: null,
    broadcastCounter: 0
  }),

  actions: {
    recordBroadcast(type) {
      this.lastBroadcastType = type
      this.broadcastCounter++
    }
  }
})
