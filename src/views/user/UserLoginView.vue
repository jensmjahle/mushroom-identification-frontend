<template>
  <div class="main-user-view">
    <div class="user-display-card flex flex-col items-center justify-center px-6 py-10 text-center overflow-y-auto w-full max-w-3xl gap-6">
      <div class="w-full max-w-sm space-y-6">
        <h1 class="text-xl sm:text-2xl font-bold text-text1">
          {{ t('loginUser.heading') }}
        </h1>

        <BaseInput
          v-model="code"
          :label="t('loginUser.refLabel')"
          :placeholder="t('loginUser.placeholder')"
          id="ref-code"
        />

        <!-- Error message -->
        <p v-if="error" class="text-red-500 text-sm sm:text-base">
          {{ error }}
        </p>

        <BaseButton
          variant="1"
          @click="login"
          :disabled="!code.trim()"
          block
        >
          {{ t('loginUser.button') }}
        </BaseButton>
      </div>
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
import { loginUser } from '@/services/authService.js'

const code = ref('')
const error = ref(null)
const router = useRouter()
const { t } = useI18n()

const login = async () => {
  if (!code.value.trim()) {
    error.value = t('loginUser.errorEmpty')
    return
  }

  try {
    error.value = null
    const response = await loginUser(code.value)
    const token = response.data.token
    sessionStorage.setItem('jwt', token)
    const userRequestId = parseJwt(token)?.sub

    await router.push({
      name: 'user-request',
      params: { userRequestId }
    })
  } catch (err) {
    error.value = t('loginUser.errorInvalid')
    console.error(err)
  }
}
</script>
