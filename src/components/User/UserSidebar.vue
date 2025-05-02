<template>
  <nav :class="['user-sidebar', collapsed ? 'collapsed' : '']">

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
        <span class="user-sidebar-text text-sm whitespace-normal break-words">
          {{ t('sideMenu.chat') }}
        </span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'home' }">
      <router-link :to="{ name: 'home' }" class="user-sidebar-link">
        <HomeIcon class="user-sidebar-icon" />
        <span class="user-sidebar-text text-sm whitespace-normal break-words">
          {{ t('sideMenu.home') }}
        </span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'new-request' }">
      <router-link :to="{ name: 'new-request' }" class="user-sidebar-link">
        <SendIcon class="user-sidebar-icon" />
        <span class="user-sidebar-text text-sm whitespace-normal break-words">
          {{ t('sideMenu.newRequest') }}
        </span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'user-login' }">
      <router-link :to="{ name: 'user-login' }" class="user-sidebar-link">
        <CheckCircle class="user-sidebar-icon" />
        <span class="user-sidebar-text text-sm whitespace-normal break-words">
          {{ t('sideMenu.login') }}
        </span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'become-member' }">
      <router-link :to="{ name: 'become-member' }" class="user-sidebar-link">
        <Star class="user-sidebar-icon" />
        <span class="user-sidebar-text text-sm whitespace-normal break-words">
          {{ t('sideMenu.membership') }}
        </span>
      </router-link>
    </div>

    <div class="user-sidebar-button" :class="{ active: $route.name === 'support' }">
      <router-link :to="{ name: 'support' }" class="user-sidebar-link">
        <HelpingHand class="user-sidebar-icon" />
        <span class="user-sidebar-text text-sm whitespace-normal break-words">
          {{ t('sideMenu.support') }}
        </span>
      </router-link>
    </div>

  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { parseJwt } from '@/utils/jwt'
import {
  HomeIcon,
  SendIcon,
  CheckCircle,
  Star,
  HelpingHand,
  MessageCircle
} from 'lucide-vue-next'

defineProps({ collapsed: Boolean })
const { t } = useI18n()

const chatRequestId = ref(null)

function updateFromStorage() {
  const jwt = sessionStorage.getItem('jwt') || localStorage.getItem('jwt')
  if (!jwt) {
    chatRequestId.value = null
    return
  }

  try {
    const payload = parseJwt(jwt)
    chatRequestId.value = payload?.sub || null
  } catch (e) {
    console.warn('Invalid token:', e)
    chatRequestId.value = null
  }
}

onMounted(() => {
  updateFromStorage()
  window.addEventListener('storage', updateFromStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', updateFromStorage)
})
</script>
