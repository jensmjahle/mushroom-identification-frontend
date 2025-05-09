<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-2xl font-semibold">{{ t('submit.thankYou') }}</h2>
    <p class="text-center max-w-md">{{ t('submit.thankYouHint') }}</p>
    <div class="flex gap-4">
      <RouterLink :to="{ name: 'home' }">
        <BaseButton data-testid="home-button" @click="$emit('finish')">
          Home
        </BaseButton>
      </RouterLink>
      <BaseButton data-testid="chat-button" @click="goToChat" :disabled="loading" class="flex items-center gap-2">
        <svg
          v-if="loading"
          class="animate-spin h-5 w-5 text-text1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span>{{ t('submit.goToChat') }}</span>
      </BaseButton>
    </div>
    <p v-if="error" class="text-sm text-danger mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import { loginUser } from '@/services/authService.js'
import { parseJwt } from '@/utils/jwt.js'

const props = defineProps({
  referenceCode: {
    type: String,
    required: true
  }
})

defineEmits(['finish'])

const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const error = ref(null)

const goToChat = async () => {
  try {
    loading.value = true
    const response = await loginUser(props.referenceCode)
    const token = response.data.token
    sessionStorage.setItem('jwt', token)
    window.dispatchEvent(new Event('storage'))
    const userRequestId = parseJwt(token)?.sub

    await router.push({
      name: 'user-request',
      params: { userRequestId }
    })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
