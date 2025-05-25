<template>
  <div>
    <LogoButton />
    <hr class="my-4 border-border2" />
    <h2 class="text-xl font-semibold text-text4 text-center mb-4 mt-4">
      {{ $t('sideMenu.menuTitle') || 'Menu' }}
    </h2>
    
    <div class="space-y-2">
      <!-- Go to Chat (if token is present) -->
      <RouterLink
        v-if="chatRequestId && platformRole"
        :to="{ name: 'user-request', params: { userRequestId: chatRequestId } }"
        class="btn-4 block w-full text-center"
        :class="{ 'ring-2 ring-button1': $route.name === 'user-request' }"
      >
        {{ $t('sideMenu.chat') }}
      </RouterLink>
      
      <RouterLink to="/" class="btn-2 block w-full text-center">
        {{ $t('sideMenu.home') }}
      </RouterLink>

      <RouterLink to="/new" class="btn-4 block w-full text-center">
        {{ $t('sideMenu.newRequest') }}
      </RouterLink>

      <RouterLink
        :to="{ name: 'user-login' }"
        class="btn-4 block w-full text-center"
        :class="{ 'ring-2 ring-button1': $route.name === 'user-login' }"
      >
        {{ $t('sideMenu.login') }}
      </RouterLink>


      <RouterLink to="/become-member" class="btn-4 block w-full text-center">
        {{ $t('sideMenu.membership') }}
      </RouterLink>

      <RouterLink to="/support" class="btn-4 block w-full text-center">
        {{ $t('sideMenu.support') }}
      </RouterLink>
    </div>

    <hr class="my-4 border-border2" />

    <LanguageSelect />
    <ThemeSelect />
    <ClearSession />
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { parseJwt } from '@/utils/jwt'
import LogoButton from '@/components/LogoButton.vue'
import LanguageSelect from '@/components/settings/LanguageSelect.vue'
import ThemeSelect from '@/components/settings/ThemeSelect.vue'
import ClearSession from '@/components/settings/ClearSession.vue'

const chatRequestId = ref(null)
const platformRole = ref(false)
const $route = useRoute()

onMounted(() => {
  const jwt = typeof window !== 'undefined'
    ? sessionStorage?.getItem('jwt') || localStorage?.getItem('jwt')
    : null

  if (!jwt) return

  try {
    const payload = parseJwt(jwt)
    const role = payload?.role?.toUpperCase?.() || ''
    platformRole.value = role !== 'ADMIN' && role !== 'SUPERUSER'
    chatRequestId.value = platformRole.value ? payload?.sub || null : null
  } catch (e) {
    console.warn('Invalid JWT:', e)
    chatRequestId.value = null
    platformRole.value = false
  }
})
</script>
