import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let chatClient = null;

export function connectToChat(userRequestId, token, onMessageCallback) {
  const username = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

  chatClient = new Client({
    webSocketFactory: () => {
      const baseUrl = window?.env?.VITE_API_URL || 'http://localhost:8080';
      return new SockJS(`${baseUrl}/ws`);
    },
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: (str) => console.log('[ChatSocket] ' + str),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[ChatSocket] Connected to chatroom');

      chatClient.subscribe(
          `/topic/chatroom/${userRequestId}`,
          (message) => {
            const body = JSON.parse(message.body);
            onMessageCallback(body);
          },
          { Authorization: `Bearer ${token}` }
      );
    },
    onStompError: (frame) => {
      console.error('[ChatSocket] STOMP error:', frame);
    },
    onWebSocketError: (event) => {
      console.error('[ChatSocket] WebSocket error:', event);
    }
  });

  chatClient.activate();
}

export function sendMessage(userRequestId, token, message) {
  if (!chatClient || !chatClient.connected) {
    console.error('[ChatSocket] Not connected');
    return;
  }

  chatClient.publish({
    destination: `/app/chat/${userRequestId}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(message)
  });
}

export function disconnectFromChat() {
  if (chatClient) {
    chatClient.deactivate();
    chatClient = null;
  }
}
