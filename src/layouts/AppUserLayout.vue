<template>
  <div class="user-layout">
    <SettingsWidget />
    <MobileHamburgerMenu>
      <UserSideMenuContent />
    </MobileHamburgerMenu>
    <div class="user-layout-inner">
      <UserSidebar :collapsed="collapsed" />
      <UserDisplayCard @toggle-sidebar="collapsed = !collapsed" :collapsed="collapsed"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import UserSidebar from '@/components/user/UserSidebar.vue'
import UserDisplayCard from '@/components/user/UserDisplayCard.vue'
import SettingsWidget from '@/components/User/SettingsWidget.vue'
import MobileHamburgerMenu from '@/components/navigation/MobileHamburgerMenu.vue'
import UserSideMenuContent from '@/components/navigation/UserSideMenuContent.vue'
import {parseJwt} from "@/utils/jwt.js";
import {useRequestSocketStore} from "@/store/useRequestSocketStore.js";
import {useMushroomStore} from "@/store/useMushroomStore.js";
import {useI18n} from "vue-i18n";


const collapsed = ref(false)
const { t } = useI18n()
const mushroomStore = useMushroomStore()
const socketStore = useRequestSocketStore()
const refreshBasket = async () => {
  const token = sessionStorage.getItem('jwt')
  const requestId = token ? parseJwt(token)?.sub : null
  if (requestId) {
    await mushroomStore.fetchMushrooms(requestId)
  }
}


onMounted(() => {
  const saved = localStorage.getItem('sidebarCollapsed')
  if (saved !== null) {
    collapsed.value = saved === 'true'
  } else {
    collapsed.value = window.innerWidth < 1000
  }
  
  const token = sessionStorage.getItem('jwt')
  if (token) {
    const userRequestId = parseJwt(token)?.sub
    if (userRequestId) {
      socketStore.connect(userRequestId, token, t, (eventType) => {
        if (eventType === 'basketUpdated') refreshBasket()
        if (eventType === 'statusChanged') refreshBasket()
      })
    }

  window.addEventListener('resize', handleResize)
}
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(collapsed, (val) => {
  localStorage.setItem('sidebarCollapsed', val.toString())
})

watch(() => socketStore.latestNotification, (notif) => {
  if (notif?.type === 'NEW_CHAT_MESSAGE') {
    // Show toast or update badge
  }
})

const handleResize = () => {
  if (window.innerWidth < 1000) {
    collapsed.value = true
  }
}
</script>
