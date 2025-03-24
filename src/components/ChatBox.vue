
<template>
  <div class="flex flex-col h-[70vh]  border border-chat-border rounded-lg overflow-hidden bg-bg">
    <!-- Messages -->
    <div class="flex-1 p-4 overflow-y-auto flex flex-col space-y-3">
    <div
          v-for="msg in messages"
          :key="msg.messageId"
          :class="[
    'max-w-[70%] px-4 py-2 rounded-lg break-words text-sm shadow-sm',
    getSide(msg) === 'me'
      ? 'self-end bg-chat-me text-white'
      : 'self-start bg-chat-other text-white'
  ]"
      >
        <p class="text-xs text-chat-meta mb-1">
         {{ formatDate(msg.createdAt) }}
        </p>
        <p>{{ msg.content }}</p>
      </div>

    </div>

    <!-- Input area -->
    <div class="flex items-center border-t border-chat-border p-3 bg-bgAlt">
      <input
          v-model="newMessage"
          @keyup.enter="send"
          placeholder="Type a message..."
          class="flex-grow px-3 py-2 border border-chat-border rounded-md focus:outline-none focus:ring-2 focus:ring-button2 hover:border-button2-border text-chat-me bg-white"
      />
      <button
          @click="send"
          class="ml-2 bg-button hover:bg-button-hover text-white px-4 py-2 rounded-md transition border border-button-border"
      >
        Send
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { connectToChat, sendMessage, disconnectFromChat } from '../services/chatSocket';
import { parseJwt } from '../utils/jwt';
import {fetchChatMessages} from "../services/apiService.js";
import { formatDate } from '../utils/formatters';


const props = defineProps({
  userRequestId: String 
});

const messages = ref([]);
const newMessage = ref('');
const token = sessionStorage.getItem('jwt');
const userRole = parseJwt(token)?.role;

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


const getSide = (msg) => {
  console.log('my role:', userRole);
  console.log('msg senderType:', msg.senderType);

  const mySenderType = userRole === 'USER' ? 'USER' : 'ADMIN';
  return msg.senderType === mySenderType ? 'me' : 'other';
};




 // Connect to the chat server when the component is mounted.
onMounted(() => {
  connectToChat(props.userRequestId, token, handleIncomingMessage);
  fetchChatMessages(props.userRequestId, token).then((data) => {
    messages.value = data;
    console.log('messages:', messages.value);
  });
});


// Disconnect from the chat server when the component is unmounted.
onBeforeUnmount(() => {
  disconnectFromChat();
});
</script>


