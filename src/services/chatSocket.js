import { Client } from '@stomp/stompjs';

let stompClient = null;

export function connectToChat(userRequestId, token, onMessageCallback) {
  stompClient = new Client({
    brokerURL: `${import.meta.env.VITE_API_URL.replace(/^http/, 'ws')}/ws?token=${token}`,
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: function (str) {
      console.log('[WebSocket] ' + str);
    },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[WebSocket] Connected');

      // Subscribe to incoming messages
      stompClient.subscribe(`/topic/chatroom/${userRequestId}`, (message) => {
        const body = JSON.parse(message.body);
        onMessageCallback(body);
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
