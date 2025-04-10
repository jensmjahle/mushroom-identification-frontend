<template>
  <div class="sm:hidden fixed top-4 right-4 z-50">
    <!-- Toggle Button -->
    <button ref="toggleButtonRef" @click="menuOpen = !menuOpen" class="btn-icon-4">
      <Menu v-if="!menuOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <!-- Menu -->
    <Transition name="slide">
      <div v-if="menuOpen" ref="menuRef" class="fixed top-0 right-0 w-64 h-full bg-bg4 text-text4 shadow-lg z-40 p-4 flex flex-col gap-4 overflow-y-auto">
        <h2 class="text-lg font-bold mb-2">{{ $t('sideMenu.completedTitle') }}: {{ completedCount }}</h2>
        <BaseButton @click="closeAndGo('admin-next-request')" block :variant="2">{{ $t('sideMenu.nextFromQueue') }}</BaseButton>
        <BaseButton @click="closeAndGo('admin-all-requests')" block :variant="4">{{ $t('sideMenu.allRequests') }}</BaseButton><BaseButton @click="closeAndGo('admin-statistics')" block :variant="4">{{ $t('sideMenu.statistics') }}</BaseButton>

        <ul class="p-4 space-y-2 w-full">
          <StatusIndicator label="New" :count="newCount" status="NEW" />
          <StatusIndicator label="Pending" :count="pendingCount" status="PENDING" />
          <StatusIndicator label="Completed" :count="completedCount" status="COMPLETED" />
        </ul>

        <div class="p-4 space-y-2 w-fill">
          <h3 class="text-left text-text4">{{ $t('sideMenu.admins') }}</h3>
          <BaseButton @click="closeAndGo('admin-all-admins')" block :variant="2">{{ $t('sideMenu.allAdmins') }}</BaseButton>
          <BaseButton @click="closeAndGo('admin-create-admin')" block :variant="4">{{ $t('sideMenu.createNewAdmin') }}</BaseButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'
import { useRouter } from 'vue-router'
import { getCountOfRequestFromStatus } from '@/services/apiService.js'
import BaseButton from '@/components/base/BaseButton.vue'
import { Menu, X } from 'lucide-vue-next'
import StatusIndicator from "@/components/base/StatusIndicator.vue"

const router = useRouter()
const token = sessionStorage.getItem('jwt')

const menuOpen = ref(false)
const menuRef = ref(null)
const toggleButtonRef = ref(null)

const newCount = ref(null)
const pendingCount = ref(null)
const completedCount = ref(null)

const fetchCounts = async () => {
  try {
    newCount.value = await getCountOfRequestFromStatus("NEW", token)
    pendingCount.value = await getCountOfRequestFromStatus("PENDING", token)
    completedCount.value = await getCountOfRequestFromStatus("COMPLETED", token)
  } catch (error) {
    console.error("Failed to fetch counts:", error)
    newCount.value = '?'
  }
}

// Add click listener AFTER menu is open
watch(menuOpen, (open) => {
  if (open) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

const handleClickOutside = (event) => {
  const target = event.target
  if (
      !menuRef.value?.contains(target) &&
      !toggleButtonRef.value?.contains(target)
  ) {
    menuOpen.value = false
  }
}

onMounted(() => {
  fetchCounts()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const closeAndGo = (routeName) => {
  menuOpen.value = false
  router.push({ name: routeName })
}
</script>


<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0%);
}
.slide-leave-to {
  transform: translateX(100%);
}
</style>
