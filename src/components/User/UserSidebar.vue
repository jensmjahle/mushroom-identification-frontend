<template>
  <nav :class="['user-sidebar', collapsed ? 'collapsed' : '']">

    <!-- Go to Chat - øverst -->
    <div
      v-if="chatRequestId"
      class="user-sidebar-button"
      :class="{ active: $route.name === 'user-request' }"
    >
      <router-link
        :to="{ name: 'user-request', params: { userRequestId: chatRequestId } }"
        class="user-sidebar-link"
      >
        <MessageCircle class="user-sidebar-icon" />
        <span class="user-sidebar-text">Go to Chat</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'home' }">
      <router-link :to="{ name: 'home' }" class="user-sidebar-link">
        <HomeIcon class="user-sidebar-icon" />
        <span class="user-sidebar-text">Home</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'new-request' }">
      <router-link :to="{ name: 'new-request' }" class="user-sidebar-link">
        <SendIcon class="user-sidebar-icon" />
        <span class="user-sidebar-text">Send In</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'user-login' }">
      <router-link :to="{ name: 'user-login' }" class="user-sidebar-link">
        <CheckCircle class="user-sidebar-icon" />
        <span class="user-sidebar-text">Check Answer</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'become-member' }">
      <router-link :to="{ name: 'become-member' }" class="user-sidebar-link">
        <Star class="user-sidebar-icon" />
        <span class="user-sidebar-text">Become a Member</span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'support' }">
      <router-link :to="{ name: 'support' }" class="user-sidebar-link">
        <HelpingHand class="user-sidebar-icon" />
        <span class="user-sidebar-text">Support</span>
      </router-link>
    </div>

  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { HomeIcon, SendIcon, CheckCircle, Star, HelpingHand, MessageCircle } from 'lucide-vue-next'
import { parseJwt } from '@/utils/jwt'

defineProps({ collapsed: Boolean })

const chatRequestId = ref(null)

onMounted(() => {
  const jwt = sessionStorage.getItem('jwt') || localStorage.getItem('jwt')
  if (!jwt) return
  try {
    const payload = parseJwt(jwt)
    if (payload?.sub) {
      chatRequestId.value = payload.sub
    }
  } catch (e) {
    console.warn('Invalid token:', e)
  }
})
</script>
