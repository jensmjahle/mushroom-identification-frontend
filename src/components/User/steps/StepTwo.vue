<template>
  <div class="flex flex-col items-center gap-6">
    <h2 class="text-2xl font-semibold">{{ t('submit.reference') }}</h2>
    <p class="text-center max-w-md text-text1-faded">
      {{ t('submit.referenceHint') }}
    </p>

    <!-- Referansekode + Kopier-knapp -->
    <div class="px-4 py-6 w-full rounded border-2 border-bg1 bg-bg2 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="font-mono text-lg break-words text-text1 text-center sm:text-left">
        {{ referenceCode }}
      </div>
      <BaseButton variant="2" size="sm" @click="copyToClipboard">
        <span v-if="copied">{{ t('submit.copied') }}</span>
        <span v-else>{{ t('submit.copy') }}</span>
      </BaseButton>
    </div>

    <!-- Neste-knapp som åpner popup -->
    <BaseButton class="mt-6" @click="readyModalVisible = true">
      {{ t('submit.next') }}
    </BaseButton>

    <!-- Modal: Er du klar? -->
    <div
      v-if="readyModalVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-bg1 border border-border1 rounded-2xl p-6 w-[90%] max-w-md text-center shadow-xl">
        <h3 class="text-xl font-semibold mb-4">
          {{ t('submit.readyQuestion') }}
        </h3>
        <p class="text-text1-faded mb-6">
          {{ t('submit.readyDetail') }}
        </p>
        <div class="flex justify-center gap-4">
          <BaseButton @click="confirmAndProceed">
            {{ t('submit.proceedButton') }}
          </BaseButton>
          <BaseButton variant="2" @click="cancelNavigation">
            {{ t('submit.cancel') }}
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

function copyToClipboard() {
  navigator.clipboard.writeText(props.referenceCode)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

// === Refresh/lukking av siden ===
function handleBeforeUnload(e) {
  e.preventDefault()
  e.returnValue = ''
}
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// === Intern Vue-navigasjon (f.eks. sidebar) ===
onBeforeRouteLeave((to, from, next) => {
  if (!readyModalVisible.value) {
    readyModalVisible.value = true
    pendingNavigation.value = next
  } else {
    next()
  }
})

// === Hvis brukeren trykker "Fortsett" ===
function confirmAndProceed() {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (pendingNavigation.value) {
    pendingNavigation.value()
  } else {
    emit('next')
  }
}

// === Hvis brukeren avbryter popup ===
function cancelNavigation() {
  readyModalVisible.value = false
  pendingNavigation.value = null
}
</script>
