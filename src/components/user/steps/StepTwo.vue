<template>
  <div class="flex flex-col items-center gap-6" data-testid="step-two">
    <h2 class="text-2xl font-semibold" data-testid="step-two-title">{{ t('submit.thankYou') }}</h2>
    <p class="text-center max-w-md text-text1-faded" data-testid="reference-hint">
      {{ t('submit.referenceHint') }}
    </p>

    <div class="px-4 py-6 w-full rounded border-2 border-bg1 bg-bg2 flex flex-col sm:flex-row items-center justify-between gap-4" data-testid="reference-code-container">
      <div class="font-mono text-lg break-words text-text1 text-center sm:text-left" data-testid="reference-code">
        {{ referenceCode }}
      </div>
      <BaseButton variant="2" size="sm" @click="copyToClipboard" data-testid="copy-button">
        <span v-if="copied" data-testid="copied-text">{{ t('submit.copied') }}</span>
        <span v-else data-testid="copy-text">{{ t('submit.copy') }}</span>
      </BaseButton>
    </div>

    <div class="flex items-center gap-2">
      <span v-if="onlineAdmins > 0" class="w-2 h-2 rounded-full bg-success animate-pulse" title="Admins are online"></span>
      <p class="text-text2-faded">
        {{ onlineAdmins > 0
          ? t('submit.adminOnline', { count: onlineAdmins })
          : t('submit.noAdminsOnline') }}
      </p>
    </div>

    <p class="text-center max-w-md text-text1-faded" data-testid="thank-you-hint">
      {{ t('submit.thankYouHint') }}
    </p>

    <div class="flex flex-col sm:flex-row gap-4 mt-2">
      <BaseButton
        data-testid="chat-button"
        @click="goToChat"
        :disabled="loading"
        class="flex items-center justify-center gap-2"
      >
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
      <RouterLink :to="{ name: 'home' }">
        <BaseButton variant="3" data-testid="home-button" @click="allowNavigation = true">
          {{ t('submit.toFront') }}
        </BaseButton>
      </RouterLink>
    </div>
    <p v-if="error" class="text-sm text-danger mt-2" data-testid="chat-error">{{ error }}</p>

    <div
      v-if="readyModalVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      data-testid="ready-modal"
    >
      <div class="bg-bg1 border border-border1 rounded-2xl p-6 w-[90%] max-w-md text-center shadow-xl">
        <h3 class="text-xl font-semibold mb-4" data-testid="ready-question">
          {{ t('submit.readyQuestion') }}
        </h3>
        <p class="text-text1-faded mb-6" data-testid="ready-detail">
          {{ t('submit.readyDetail') }}
        </p>
        <div class="flex justify-center gap-4">
          <BaseButton variant="2" @click="cancelNavigation" data-testid="cancel-button">
            {{ t('submit.cancel') }}
          </BaseButton>
          <BaseButton @click="confirmAndProceed" data-testid="proceed-button">
            {{ t('submit.proceedButton') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import { getOnlineAdminCount } from '@/services/rest/websocketService.js'
import { loginUser } from '@/services/rest/authService.js'
import { parseJwt } from '@/utils/jwt.js'

const { t } = useI18n()
const router = useRouter()
const props = defineProps({
  referenceCode: {
    type: String,
    required: true
  }
})

const copied = ref(false)
const onlineAdmins = ref(0)
const loading = ref(false)
const error = ref(null)

// Guards against accidentally losing the reference code via the browser back
// button, closing the tab, or clicking away to another page - but not
// against the in-page "Go to Chat" / "Home" buttons themselves, which are
// the intended ways to leave this screen and shouldn't need a second
// confirmation on top of the click that already expressed that intent.
const readyModalVisible = ref(false)
const pendingNavigation = ref(null)
const allowNavigation = ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(props.referenceCode)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function handleBeforeUnload(e) {
  e.preventDefault()
  e.returnValue = ''
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  fetchOnlineAdmins()
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

onBeforeRouteLeave((to, from, next) => {
  if (allowNavigation.value) {
    next()
    return
  }
  readyModalVisible.value = true
  pendingNavigation.value = next
})

function confirmAndProceed() {
  readyModalVisible.value = false
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (pendingNavigation.value) {
    pendingNavigation.value()
    pendingNavigation.value = null
  }
}

function cancelNavigation() {
  readyModalVisible.value = false
  pendingNavigation.value = null
}

const fetchOnlineAdmins = async () => {
  onlineAdmins.value = await getOnlineAdminCount()
}

const goToChat = async () => {
  try {
    loading.value = true
    const response = await loginUser(props.referenceCode)
    const token = response.data.token
    sessionStorage.setItem('jwt', token)
    window.dispatchEvent(new Event('storage'))
    const userRequestId = parseJwt(token)?.sub

    allowNavigation.value = true
    window.removeEventListener('beforeunload', handleBeforeUnload)
    await router.push({
      name: 'user-request',
      params: { userRequestId }
    })
  } catch (err) {
    console.error(err)
    error.value = t('errors.enteringChat')
  } finally {
    loading.value = false
  }
}
</script>
