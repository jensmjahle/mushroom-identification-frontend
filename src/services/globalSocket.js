import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useToast } from 'vue-toastification';

let globalClient = null;

export function initGlobalSocket(token, onErrorCallback, onAdminBroadcast, onNotification, t) {
  const toast = useToast();
  const username = JSON.parse(atob(token.split('.')[1])).sub;

  globalClient = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: str => console.log('[GlobalSocket] ' + str),
    reconnectDelay: 5000,

    onConnect: () => {
      console.log('[GlobalSocket] Connected');

      // Error topic
      globalClient.subscribe(
          `/topic/errors/${username}`,
          (message) => {
            const error = JSON.parse(message.body);
            console.error('[GlobalSocket] Received error:', error);

            const type = error.type || 'GENERIC';
            const fallback = error.message || t('errors.GENERIC');
            const translated = error.i18n
                ? t(error.i18n, {}, { default: fallback })
                : t(`errors.${type}`, {}, { default: fallback });

            toast.error(translated);

            if (type === 'UNAUTHORIZED') {
              disconnectGlobalSocket();
            }

            if (onErrorCallback) onErrorCallback(error);
          },
          { Authorization: `Bearer ${token}` }
      );

      // Admin broadcast topic
      globalClient.subscribe(
          `/topic/admins`,
          (message) => {
            const broadcast = JSON.parse(message.body);
            console.log('[GlobalSocket] Admin broadcast:', broadcast);
            if (onAdminBroadcast) onAdminBroadcast(broadcast);
          },
          { Authorization: `Bearer ${token}` }
      );

      // Notification topic
      globalClient.subscribe(
          `/topic/notifications/${username}`,
          (message) => {
            const notif = JSON.parse(message.body);
            console.log('[GlobalSocket] Notification:', notif);

            const fallback = notif.message || t('notification.default');
            const translated = notif.i18n
                ? t(notif.i18n, {}, { default: fallback })
                : fallback;

            if (notif.type === 'INFO') {
              toast.info(translated);
            } else if (notif.type === 'ALERT') {
              toast.warning(translated);
            } else {
              toast(translated);
            }

            if (onNotification) onNotification(notif);
          },
          { Authorization: `Bearer ${token}` }
      );
    },

    onStompError: (frame) => {
      console.error('[GlobalSocket] STOMP error:', frame);
      toast.error(t('errors.STOMP', 'WebSocket protocol error.'));
    },

    onWebSocketError: (event) => {
      console.error('[GlobalSocket] WebSocket connection error:', event);
      toast.error(t('errors.CONNECTION_FAILED', 'Could not connect to WebSocket.'));
    }
  });

  globalClient.activate();
}

export function disconnectGlobalSocket() {
  if (globalClient) {
    globalClient.deactivate().then(() => console.log('[GlobalSocket] Disconnected'));
    globalClient = null;
  }
}
