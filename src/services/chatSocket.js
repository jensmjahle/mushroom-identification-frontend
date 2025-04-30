import { Client } from '@stomp/stompjs';
import {useToast} from "vue-toastification";

let stompClient = null;

export function connectToChat(userRequestId, token, onMessageCallback, onErrorCallback) {
  
  const username = token ? JSON.parse(atob(token.split('.')[1])).sub : null;
  
  stompClient = new Client({
    brokerURL: `ws://localhost:8080/ws?token=${token}`,
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: function (str) {
      console.log('[WebSocket] ' + str);
    },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[WebSocket] Connected');

      // Subscribe to incoming chat messages
      stompClient.subscribe(`/topic/chatroom/${userRequestId}`, (message) => {
        const body = JSON.parse(message.body);
        onMessageCallback(body);
      });

      // Subscribe to error messages
      stompClient.subscribe(`/topic/errors/${username}`, (message) => {
        const error = JSON.parse(message.body);
        console.error('[WebSocket] Received Error:', error);
        useToast().error(`Error: ${error.message}`);
        if (onErrorCallback) {
          onErrorCallback(error);
        }
      });

    },
    onStompError: (frame) => {
      console.error('[WebSocket] STOMP Error', frame);
    }
  });

  stompClient.activate();
}

export function sendMessage(userRequestId, token, message) {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket is not connected');
    return;
  }

  stompClient.publish({
    destination: `/app/chat/${userRequestId}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(message)
  });
}

export function disconnectFromChat() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
