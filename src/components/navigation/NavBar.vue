<template>
  <nav class="hidden sm:flex fixed top-4 right-4 z-30">
    <div class="relative flex items-center gap-4">

      <RoleBadge :role="role" />

      <!-- User Circle Button -->
      <button
          @click="toggleDropdown"
          class="w-10 h-10 rounded-full bg-button1 hover:bg-button1-hover flex items-center justify-center text-white font-bold uppercase"
      >
        {{ username?.charAt(0) }}
      </button>

      <!-- Dropdown Menu -->
      <div
          v-if="dropdownOpen"
          class="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg text-gray-700"
      >
        <ul class="py-2">
          <li>
            <button @click="goToSettings" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Settings
            </button>
          </li>
          <li>
            <button @click="logout" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Log out
            </button>
          </li>
        </ul>
      </div>

    </div>
  </nav>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { parseJwt } from '@/utils/jwt'
import { ShieldCheck } from 'lucide-vue-next'
import RoleBadge from "@/components/badges/RoleBadge.vue";

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
  router.push('/admin/login')
}

const goToSettings = () => {
  router.push('/admin/settings')
}

const getRoleClass = (role) => {
  switch (role) {
    case 'SUPERUSER':
      return 'bg-role-superuser text-role-superuser-meta'
    case 'MODERATOR':
      return 'bg-role-moderator text-role-moderator-meta'
    default:
      return 'bg-gray-400 text-white'
  }
}
</script>
