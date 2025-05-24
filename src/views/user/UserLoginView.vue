<template>
  <div class="flex flex-col justify-center items-center px-6 py-10 text-center overflow-y-auto w-full h-full gap-6">
    <!-- Heading & Introduction -->
    <div class="text-center mb-4">
      <h1 class="text-2xl font-bold text-text1" data-testid="login-heading">{{ t('loginUser.heading') }}</h1>
      <p class="text-sm text-text2-faded" data-testid="login-description">{{ t('loginUser.description') }}</p>
    </div>

    <!-- Login form -->
    <form @submit.prevent="login" class="w-full max-w-md bg-bg2 p-4 rounded-lg space-y-4" data-testid="login-form">
      <BaseInput
        v-model="code"
        id="ref-code"
        type="text"
        :label="t('loginUser.refLabel')"
        :placeholder="t('loginUser.placeholder')"
        data-testid="ref-code-input"
      />

      <BaseButton block type="submit" :disabled="!code.trim() || loading" class="flex items-center justify-center gap-2" data-testid="submit-button">
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
        <span>{{ t('loginUser.button') }}</span>
      </BaseButton>

      <!-- Error message -->
      <p v-if="error" class="text-danger text-sm text-center" data-testid="error-message">{{ error }}</p>
    </form>

    <!-- Helper text -->
    <div class="mt-4 text-sm text-center text-text1 space-y-1">
      <p data-testid="no-code-question">{{ t('loginUser.noCodeQuestion') }}</p>
      <router-link to="/" class="text-button1-hover hover:underline font-medium" data-testid="home-link">
        {{ t('loginUser.homeLink') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useI18n } from 'vue-i18n'
import { parseJwt } from '@/utils/jwt.js'
import { loginUser } from '@/services/rest/authService.js'
import {useRequestSocketStore} from "@/store/useRequestSocketStore.js";
import {useToast} from "vue-toastification";

const code = ref('')
const error = ref(null)
const router = useRouter()
const { t } = useI18n()
const loading = ref(false)

const login = async () => {
  if (!code.value.trim()) {
    error.value = t('loginUser.errorEmpty')
    return
  }

  loading.value = true
  try {
    error.value = null
    const response = await loginUser(code.value)
    const token = response.data.token
    sessionStorage.setItem('jwt', token)
    window.dispatchEvent(new Event('storage'))
    const userRequestId = parseJwt(token)?.sub

    await router.push({
      name: 'user-request',
      params: { userRequestId }
    })

    const { connect } = useRequestSocketStore()
    connect(userRequestId, token, t, null)
  } catch (err) {
    error.value = t('loginUser.errorInvalid')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
