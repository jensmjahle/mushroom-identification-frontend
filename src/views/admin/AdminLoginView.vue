<!-- AdminLoginView.vue -->
<template>
  <div class="relative h-full w-full flex flex-col items-center justify-center">
    <!-- Reactive horizontal logo -->
    <img
      :src="logoSrc"
      alt="Fleinsoppkontroll logo"
      class="absolute top-4 left-4 w-52 h-auto"
    />

    <AdminLoginForm :onLogin="loginUser" />
    <SettingsWidget />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLoginForm from '@/components/admin/AdminLoginForm.vue';
import { loginAdmin } from '@/services/rest/authService';
import { detectInitialTheme } from '@/utils/themeUtils';
import SettingsWidget from '@/components/settings/SettingsWidget.vue';

const theme = ref(detectInitialTheme());
const router = useRouter();

onMounted(() => {
  window.addEventListener('theme-changed', () => {
    theme.value = detectInitialTheme();
  });
});

const logoSrc = computed(() => theme.value === 'dark' ? '/assets/logo-horizontal-text-white.svg' : '/assets/logo-horizontal-text-black.svg');

const loginUser = async (username: string, password: string) => {
  try {
    const response = await loginAdmin(username, password);
    const token = response.data.token;

    if (token) {
      sessionStorage.setItem('jwt', token);
      await router.push({ name: 'admin-dashboard' });
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
</script>
