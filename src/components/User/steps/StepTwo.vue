<template>
  <div class="flex flex-col items-center gap-6" data-testid="step-two">
    <h2 class="text-2xl font-semibold" data-testid="step-two-title">{{ t('submit.reference') }}</h2>
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
    <div class="flex items-center gap-2 ">
      <span v-if="onlineAdmins > 0" class="w-2 h-2 rounded-full bg-success animate-pulse" title="Admins are online"></span>
      <p class="text-text2-faded">
        {{ onlineAdmins > 0
          ? t('submit.adminOnline', { count: onlineAdmins })
          : t('submit.noAdminsOnline') }}
      </p>
    </div>


    <BaseButton class="mt-6" @click="readyModalVisible = true" data-testid="next-step-button">
      {{ t('submit.next') }}
    </BaseButton>

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
import {getOnlineAdminCount} from "@/services/rest/websocketService.js";

const { t } = useI18n()
const router = useRouter()
const props = defineProps({
  referenceCode: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['next'])

const copied = ref(false)
const readyModalVisible = ref(false)
const pendingNavigation = ref(null)
const onlineAdmins = ref(0)


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
  if (!readyModalVisible.value) {
    readyModalVisible.value = true
    pendingNavigation.value = next
  } else {
    next()
  }
})

function confirmAndProceed() {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (pendingNavigation.value) {
    pendingNavigation.value()
  } else {
    emit('next', props.referenceCode)
  }
}

function cancelNavigation() {
  readyModalVisible.value = false
  pendingNavigation.value = null
}
const fetchOnlineAdmins = async () => {
  onlineAdmins.value = await getOnlineAdminCount()
}
</script>
