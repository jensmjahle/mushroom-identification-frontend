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
import UserSidebar from '../components/user/UserSidebar.vue'
import UserDisplayCard from '../components/user/UserDisplayCard.vue'
import SettingsWidget from '../components/settings/SettingsWidget.vue'
import MobileHamburgerMenu from '../components/navigation/MobileHamburgerMenu.vue'
import UserSideMenuContent from '../components/navigation/UserSideMenuContent.vue'


const collapsed = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('sidebarCollapsed')
  if (saved !== null) {
    collapsed.value = saved === 'true'
  } else {
    collapsed.value = window.innerWidth < 1000
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(collapsed, (val) => {
  localStorage.setItem('sidebarCollapsed', val.toString())
})

const handleResize = () => {
  if (window.innerWidth < 1000) {
    collapsed.value = true
  }
}
</script>
