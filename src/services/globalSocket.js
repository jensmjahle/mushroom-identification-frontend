import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useToast } from 'vue-toastification';

let globalClient = null;

export function initGlobalSocket(token, onErrorCallback, onAdminBroadcast, onNotification) {
  const username = JSON.parse(atob(token.split('.')[1])).sub;

  globalClient = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: (str) => console.log('[GlobalSocket] ' + str),
    reconnectDelay: 5000,

    onConnect: () => {
      const toast = useToast();
      console.log('[GlobalSocket] Connected');

      globalClient.subscribe(
          `/topic/errors/${username}`,
          (message) => {
            const error = JSON.parse(message.body);
            console.error('[GlobalSocket] Received error:', error);
            toast.error(`${error.message}`);

            if (error.type === 'UNAUTHORIZED') {
              disconnectGlobalSocket();
              toast.error('You are not authorized to perform this action');
              if (onErrorCallback) onErrorCallback(error);
            } else if (onErrorCallback) {
              onErrorCallback(error);
            }
          },
          { Authorization: `Bearer ${token}` }
      );

      globalClient.subscribe(
          `/topic/admins`,
          (message) => {
            const broadcast = JSON.parse(message.body);
            console.log('[GlobalSocket] Admin broadcast:', broadcast);
            if (onAdminBroadcast) onAdminBroadcast(broadcast);
          },
          { Authorization: `Bearer ${token}` }
      );

      globalClient.subscribe(
          `/topic/notifications/${username}`,
          (message) => {
            const notif = JSON.parse(message.body);
            console.log('[GlobalSocket] Notification:', notif);

            if (notif.type === 'INFO') {
              toast.info(notif.message);
            } else if (notif.type === 'ALERT') {
              toast.warning(notif.message);
            } else {
              toast(`Notification: ${notif.message}`);
            }

            if (onNotification) {
              onNotification(notif);
            }
          },
          { Authorization: `Bearer ${token}` }
      );
    },

    onStompError: (frame) => {
      const toast = useToast();
      console.error('[GlobalSocket] STOMP error:', frame);
      toast.error('Global WebSocket STOMP error');
    },

    onWebSocketError: (event) => {
      const toast = useToast();
      console.error('[GlobalSocket] WebSocket connection error:', event);
      toast.error('Failed to connect to admin WebSocket');
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
