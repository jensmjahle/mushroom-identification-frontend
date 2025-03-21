<template>
  <div class="chatbox">
    <div class="messages">
      <div
          v-for="msg in messages"
          :key="msg.messageId"
          :class="['message', getSide(msg.senderType)]"
      >
        <p class="message-meta">
          {{ msg.senderType }} — {{ formatDate(msg.createdAt) }}
        </p>
        <p class="message-content">{{ msg.content }}</p>
      </div>
    </div>

    <div class="input-area">
      <input
          v-model="newMessage"
          @keyup.enter="send"
          placeholder="Type a message..."
      />
      <button @click="send">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { connectToChat, sendMessage, disconnectFromChat } from '../services/chatSocket';
import { parseJwt } from '../utils/jwt';

const props = defineProps({
  userRequestId: String 
});

const messages = ref([]);
const newMessage = ref('');
const token = sessionStorage.getItem('jwt');
const userRole = parseJwt(token)?.role;
const username = parseJwt(token)?.sub;

const handleIncomingMessage = (msg) => {
  messages.value.push(msg);
};

const send = () => {
  if (!newMessage.value.trim()) return;

  const messageDTO = {
    senderType: userRole === 'USER' ? 'USER' : 'ADMIN',
    createdAt: new Date(),
    text: newMessage.value
  };

  sendMessage(props.userRequestId, token, messageDTO);
  newMessage.value = '';
};

const getSide = (senderType) => {
  if (userRole === 'USER') {
    return senderType === 'USER' ? 'left' : 'right';
  } else {
    return senderType === 'ADMIN' ? 'right' : 'left';
  }
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

onMounted(() => {
  connectToChat(props.userRequestId, token, handleIncomingMessage);
});

onBeforeUnmount(() => {
  disconnectFromChat();
});
</script>

<style scoped>
.chatbox {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.messages {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  max-width: 70%;
  margin: 8px 0;
  padding: 10px;
  border-radius: 10px;
  word-wrap: break-word;
}

.message.left {
  align-self: flex-start;
  background-color: #f1f1f1;
}

.message.right {
  align-self: flex-end;
  background-color: #d1e7dd;
}

.message-meta {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4px;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.input-area input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-right: 8px;
}

.input-area button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
}
</style>
