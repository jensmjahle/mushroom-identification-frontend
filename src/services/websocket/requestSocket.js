import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useToast } from 'vue-toastification'
import { handleRequestNotification, injectToastLibrary } from '@/utils/requestNotificationHandler'

let requestClient = null

export function initRequestSocket(requestId, token, t, onUpdateCallback) {
  const toast = useToast()
  injectToastLibrary(toast)

  requestClient = new Client({
    webSocketFactory: () => {
      const baseUrl = window?.env?.VITE_API_URL || 'http://localhost:8080';
      return new SockJS(`${baseUrl}/ws`);
    },
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: str => console.log('[RequestSocket] ' + str),
    reconnectDelay: 5000,

    onConnect: () => {
      console.log('[RequestSocket] Connected to request:', requestId)

      requestClient.subscribe(
          `/topic/request/${requestId}`,
          (message) => {
            const notif = JSON.parse(message.body)
            console.log('[RequestSocket] Notification:', notif)
            handleRequestNotification(notif, t, requestId, token)
            onUpdateCallback?.(notif.type)
          },
          { Authorization: `Bearer ${token}` }
      )
    },

    onStompError: (frame) => {
      console.error('[RequestSocket] STOMP error:', frame)
      toast.error(t('errors.STOMP'))
    },

    onWebSocketError: (event) => {
      console.error('[RequestSocket] WebSocket error:', event)
      toast.error(t('errors.CONNECTION_FAILED'))
    }
  })

  requestClient.activate()
}

export function disconnectRequestSocket() {
  if (requestClient) {
    requestClient.deactivate().then(() => console.log('[RequestSocket] Disconnected'))
    requestClient = null
  }
}
