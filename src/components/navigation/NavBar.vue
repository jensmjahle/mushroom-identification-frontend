<template>
  <nav class="hidden sm:flex fixed top-4 right-4 z-30">
    <div class="relative flex items-center gap-2">

      <RoleBadge :role="role" />
      <BaseButton
          @click="toggleDropdown"
          variant="3"
          class="w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase"
      >
        {{ username?.charAt(0) }}
      </BaseButton>

      <!-- Dropdown Menu -->
      <div
          v-if="dropdownOpen"
          class="absolute right-0 top-full mt-2 w-44 bg-bg3 rounded-lg shadow-lg text-text3"
      >
        <div class="px-4 py-2 border-b border-border3 text-text3 text-sm font-medium truncate">
          {{ username }}
        </div>

        <ul class="p-2 flex flex-col gap-2">
          <li>
            <BaseButton
                @click="goToSettings"
                variant="4"
                block
                class="flex items-center gap-2 w-full"
            >
              <Settings class="w-4 h-4" />
              <span>{{ $t('navigation.settings') }}</span>
            </BaseButton>
          </li>
          <li>
            <BaseButton
                @click="logout"
                variant="4"
                block
                class="flex items-center gap-2 w-full"
            >
              <LogOut class="w-4 h-4" />
              <span>{{ $t('navigation.logout') }}</span>
            </BaseButton>
          </li>
        </ul>
      </div>

    </div>
  </nav>
</template>



<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { parseJwt } from '@/utils/jwt'
import RoleBadge from "@/components/badges/RoleBadge.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import { Settings, LogOut} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()
const router = useRouter()
const dropdownOpen = ref(false)
const token = sessionStorage.getItem('jwt')
const role = ref('')
const username = ref('')

onMounted(() => {
  if (token) {
    const decoded = parseJwt(token)
    role.value = decoded?.role || ''
    username.value = decoded?.sub || ''
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

const logout = () => {
  sessionStorage.removeItem('jwt')
  router.push({ name: 'admin-login' }) 
}

const goToSettings = () => {
  router.push({ name: 'admin-settings' })
}

</script>
