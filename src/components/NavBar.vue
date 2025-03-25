<template>
  <nav class="bg-bgAlt text-white fixed top-0 left-0 w-full z-50 shadow-md">
    <div class="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Left: Back & logo -->
      <div class="flex items-center space-x-4">
        <button
            v-if="showBackButton"
            @click="goBack"
            class="text-white hover:text-button2 transition"
        >
          ← Back
        </button>
        <router-link to="/" class="font-bold text-xl tracking-wide hover:text-button">
          Fleinsoppkontroll
        </router-link>
      </div>

      <!-- Right: Admin section -->
      <div v-if="isAdmin" class="relative flex items-center space-x-2">
        <!-- User Role Badge -->
        <div :class="['flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full text-white', getRoleClass(role)]">
          <ShieldCheck class="w-4 h-4" />
          <span class="capitalize">{{ role.toLowerCase() }}</span>
        </div>
        <span class="text-sm font-semibold">{{ username }}</span>
        <button
            @click="toggleDropdown"
            class="w-10 h-10 rounded-full bg-button hover:bg-button-hover flex items-center justify-center focus:outline-none"
        >
          <span class="text-white font-bold uppercase">
            {{ role.charAt(0) }}
          </span>
        </button>

        <!-- Dropdown menu -->
        <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 top-full w-40 bg-white rounded-md shadow-lg z-50 text-left"
        >
          <ul class="py-2 text-sm text-gray-700">
            <li>
              <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Log out
              </button>
              <button
                  @click="settings"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Settings
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { parseJwt } from '../utils/jwt';
import { ShieldCheck } from 'lucide-vue-next';


const router = useRouter();
const route = useRoute();

const dropdownOpen = ref(false);
ref(null);
const token = sessionStorage.getItem('jwt');
const role = ref(null);
const username = ref(null);

onMounted(() => {
  if (token) {
    const decoded = parseJwt(token);
    role.value = decoded?.role;
    username.value = decoded?.sub;
  }
  document.addEventListener('click', handleClickOutsideDropdown);
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideDropdown); 
})

const isAdmin = computed(() =>
    role.value === 'SUPERUSER' || role.value === 'MODERATOR'
);

const showBackButton = computed(() => {
  return route.path !== '/' && route.path !== '/admin/dashboard';
});

const goBack = () => router.back();

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleClickOutsideDropdown = (e) => {
  if (!e.target.closest('.relative')) {
    dropdownOpen.value = false;
  }
};

const logout = () => {
  sessionStorage.removeItem('jwt');
  router.push('/admin/login');
};

const settings = () => {
  router.push('/admin/settings');
};

const getRoleClass = (role) => {
  switch (role) {
    case 'SUPERUSER':
      return 'bg-role-superuser';
    case 'MODERATOR':
      return 'bg-role-moderator';
    default:
      return 'bg-gray-400';
  }
};

</script>
