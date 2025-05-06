import { defineStore } from 'pinia'
import { initRequestSocket, disconnectRequestSocket } from '@/services/websocket/requestSocket.js'

export const useRequestSocketStore = defineStore('requestSocket', {
  state: () => ({
    connectedRequestId: null,
    lastNotification: null
  }),

  getters: {
    isConnected: (state) => !!state.connectedRequestId
  },

  actions: {
    connect(requestId, token, t, onUpdateCallback) {
      if (this.connectedRequestId === requestId) return

      this.disconnect()

      this.connectedRequestId = requestId

      initRequestSocket(requestId, token, t, (event) => {
        this.lastNotification = event
        if (onUpdateCallback) onUpdateCallback(event)
      })
    },

    disconnect() {
      disconnectRequestSocket()
      this.connectedRequestId = null
      this.lastNotification = null
    }
  }
})
