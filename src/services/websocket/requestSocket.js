import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useToast } from 'vue-toastification';

let requestClient = null;

export function initRequestSocket(requestId, token, t, onUpdateCallback) {
  const toast = useToast();

  requestClient = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: str => console.log('[RequestSocket] ' + str),
    reconnectDelay: 0,

    onConnect: () => {
      console.log('[RequestSocket] Connected to request:', requestId);

      requestClient.subscribe(
          `/topic/request/${requestId}`,
          (message) => {
            const notif = JSON.parse(message.body);
            console.log('[RequestSocket] Notification:', notif);

            const fallback = notif.message || t('notification.default');
            const translated = notif.i18n
                ? t(notif.i18n, {}, { default: fallback })
                : fallback;

            switch (notif.type) {
              case 'NEW_CHAT_MESSAGE':
                if (!isOnRequestPage(requestId)) {
                  toast.info(translated);
                }
                break;

              case 'MUSHROOM_BASKET_UPDATED':
                onUpdateCallback?.('basketUpdated');
                break;

              case 'STATUS_CHANGED':
                toast.success(translated);
                onUpdateCallback?.('statusChanged');
                break;

              default:
                toast(translated);
            }
          },
          { Authorization: `Bearer ${token}` }
      );
    },

    onStompError: (frame) => {
      console.error('[RequestSocket] STOMP error:', frame);
      toast.error(t('errors.STOMP'));
    },

    onWebSocketError: (event) => {
      console.error('[RequestSocket] WebSocket error:', event);
      toast.error(t('errors.CONNECTION_FAILED'));
    }
  });

  requestClient.activate();
}

export function disconnectRequestSocket() {
  if (requestClient) {
    requestClient.deactivate().then(() => console.log('[RequestSocket] Disconnected'));
    requestClient = null;
  }
}

function isOnRequestPage(requestId) {
  return window.location.pathname.includes(`/request/${requestId}`);
}
