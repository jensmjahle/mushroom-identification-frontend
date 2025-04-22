<template>
  <div class="flex flex-col h-[70vh] max-h-[80vh] w-full mx-auto border border-chat-me_border rounded-lg overflow-hidden bg-bg1">
    <!-- Messages -->
    <div class="flex-1 p-4 overflow-y-auto flex flex-col space-y-3"  ref="messageContainer">
      <div
          v-for="msg in messages"
          :key="msg.messageId"
          :class="[
    'flex flex-col items-start',
    getSide(msg) === 'me' ? 'items-end' : 'items-start'
  ]"
      >
        <!-- Created at timestamp above the bubble -->
        <div
            class="text-xs px-2 py-1 rounded-t-md mb-1"
            :class="[
      getSide(msg) === 'me' 
        ? 'text-chat-me_bg' 
        : 'text-chat-other_border'
    ]"
        >
          {{ formatDate(msg.createdAt) }}
        </div>

        <!-- Chat bubble -->
        <div
            :class="[
      'px-4 py-2 rounded-3xl break-words text-sm shadow-sm w-fit max-w-[85%] sm:max-w-[70%]',
      getSide(msg) === 'me'
        ? 'self-end bg-chat-me_bg text-chat-me_meta border border-chat-me_border'
        : 'self-start bg-chat-other_bg text-chat-other_meta border border-chat-other_border'
    ]"
        >
          <p>{{ msg.content }}</p>
        </div>
      </div>

    </div>

    <!-- Input area -->
    <div class="flex flex-col sm:flex-row items-center border-t border-chat-me_border p-3 bg-bg2 gap-2 sm:gap-0">
      <input
          v-model="newMessage"
          @keyup.enter="send"
          placeholder="Type a message..."
          class="flex-grow w-full px-3 py-2 border border-chat-me_border rounded-md focus:outline-none focus:ring-2 focus:ring-button2 hover:border-button2-border text-text1 bg-bg1"
      />
      <button
          @click="send"
          class="sm:ml-2 w-full sm:w-auto bg-button1 hover:bg-button1-hover text-text2 px-4 py-2 rounded-md transition border border-button1-border"
      >
        Send
      </button>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick, watch} from 'vue';
import { connectToChat, sendMessage, disconnectFromChat } from '../services/chatSocket';
import { parseJwt } from '../utils/jwt';
import { formatDate } from '../utils/formatters';
import {fetchChatMessages} from "@/services/chatService.js";


const props = defineProps({
  userRequestId: String 
});

const messages = ref([]);
const newMessage = ref('');
const token = sessionStorage.getItem('jwt');
const userRole = parseJwt(token)?.role;
const messageContainer = ref(null);

const handleIncomingMessage = (msg) => {
  messages.value.push(msg);
};


const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

// Watch for changes in messages and scroll
watch(messages, () => {
  scrollToBottom();
});
const send = () => {
  if (!newMessage.value.trim()) return;

  const newMessageDTO = {
    senderType: userRole === 'USER' ? 'USER' : 'ADMIN',
    createdAt: new Date(),
    content: newMessage.value
  };

  sendMessage(props.userRequestId, token, newMessageDTO);
  newMessage.value = '';
  scrollToBottom();
};


const getSide = (msg) => {
  const mySenderType = userRole === 'USER' ? 'USER' : 'ADMIN';
  return msg.senderType === mySenderType ? 'me' : 'other';
};




 // Connect to the chat server when the component is mounted.
onMounted(() => {
  connectToChat(props.userRequestId, token, handleIncomingMessage);
  fetchChatMessages(props.userRequestId, token).then((data) => {
    messages.value = data;
    scrollToBottom();
  });
});


// Disconnect from the chat server when the component is unmounted.
onBeforeUnmount(() => {
  disconnectFromChat();
});
</script>


