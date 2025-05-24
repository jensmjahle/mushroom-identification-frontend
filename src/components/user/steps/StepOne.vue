<template>
  <div class="flex flex-col items-center justify-center w-[90%] h-full px-4 pt-20 pb-4 max-w-3xl mx-auto text-center gap-6 overflow-y-auto relative">
    <h2 class="text-2xl sm:text-3xl font-bold text-text1" data-testid="step-title">{{ t('submit.title') }}</h2>

    <!-- Tips -->
    <div class="flex flex-col gap-4 text-left w-full" data-testid="steps-container">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center gap-4 p-2 rounded-md border border-border2 bg-bg1 cursor-pointer transition hover:bg-button2-hover shadow-sm"
        @click="toggleHint(index + 1)"
        tabindex="0"
        data-testid="step-item"
      >
        <span class="w-8 h-8 text-sm rounded-md bg-button2 text-button3-meta flex items-center justify-center font-semibold shrink-0">
          {{ index + 1 }}
        </span>
        <p class="text-sm font-medium text-text1">{{ step.title }}</p>
        <svg class="ml-auto w-5 h-5 text-text1-faded" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01"/>
        </svg>
      </div>
    </div>

    <!-- Hint Modal -->
    <div v-if="hintStep !== null" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="hintStep = null" data-testid="hint-modal">
      <div class="bg-bg1 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-2 text-text1">{{ t('submit.hintTitle') }}</h3>
        <p class="text-sm text-text1-faded">{{ t(`submit.steps.${hintStep - 1}.hint`) }}</p>
        <BaseButton class="w-full mt-4" @click="hintStep = null" data-testid="close-hint">{{ t('submit.close') }}</BaseButton>
      </div>
    </div>

    <!-- Mushroom List -->
    <div class="flex w-full flex-row gap-6 items-start border border-border1" data-testid="mushroom-list">
      <div class="flex-1 border-2 border-border2 rounded-lg px-3 py-2 min-h-[140px] max-h-60 overflow-y-auto bg-bg2 w-full relative">
      <div class="sticky top-0 left-0 z-10 bg-bg2 pb-2 h-[25px] font-semibold text-text1 text-left border-b mb-2 border-border2">
        {{ t('submit.mushroomListTitle') }}
      </div>
      <template v-if="mushrooms.length">
        <div
        v-for="mushroom in mushrooms"
        :key="mushroom.id"
        class="relative border border-border2 rounded-lg p-3 bg-bg1 mb-3 flex flex-col gap-2 shadow-sm hover:shadow-md transition"
        data-testid="mushroom-item"
        >
        <XIcon class="w-4 h-4 text-text1-faded hover:text-button1-meta absolute top-2 right-2 cursor-pointer" tabindex="0" @click="removeMushroom(mushroom.id)" />
        <div class="font-semibold text-text1 text-left mb-1">
          {{ t('submit.mushroom') }} {{ mushroom.id }}
        </div>
        <div class="flex flex-wrap gap-2">
          <div
          v-for="(img, i) in mushroom.images"
          :key="i"
          class="bg-bg2 border border-border1 rounded px-3 py-1 text-xs text-text1 flex items-center"
          >
          <svg class="w-4 h-4 mr-1 text-button2-meta" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 5l3 3"/>
          </svg>
          {{ img.name }}
          </div>
        </div>
        </div>
      </template>
      <template v-else>
        <p class="text-text1-faded text-sm text-center py-6">{{ t('submit.noMushrooms') }}</p>
      </template>
      <p v-if="showErrorMushroom" class="text-sm text-danger mt-1">{{ t('submit.validation.errorMushroomMissing') }}</p>
      </div>

      <BaseButton
        variant="2"
        class="h-full w-[15%] flex items-center justify-center min-h-[140px]"
        @click="showMushroomPopup = true"
        data-testid="add-mushroom-button"
      >
        <Upload class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
      </BaseButton>
    </div>

    <!-- Comment Input -->
    <div class="w-full relative">
      <textarea
        data-testid="comment-input"
        class="w-full p-2 border border-border1 rounded text-sm resize-none min-h-[70px] text-text1 bg-bg1"
        rows="3"
        :placeholder="showErrorComment ? t('submit.validation.errorCommentMissing') : t('submit.commentPlaceholder')"
        v-model="comment"
        :class="showErrorComment ? 'border-danger text-danger placeholder-danger' : ''"
      />
    </div>

    <!-- Send -->
    <BaseButton
      data-testid="submit-button"
      class="w-full max-w-xs flex items-center justify-center gap-2"
      @click="handleSubmit"
      :disabled="loading"
    >
      <svg v-if="loading" class="animate-spin h-5 w-5 text-text1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <span>{{ t('submit.send') }}</span>
    </BaseButton>

    <!-- Popup -->
    <div v-if="showMushroomPopup" class="fixed inset-0 z-[60] backdrop-blur-sm flex items-center justify-center p-4" data-testid="mushroom-popup">
      <div class="bg-bg1 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-text1">{{ t('submit.step') }} {{ mushroomStep }} {{ t('submit.of') }} 3</h3>
          <BaseButton variant="4" class="text-xs" @click="cancelMushroom" data-testid="close-popup">{{ t('submit.close') }}</BaseButton>
        </div>

        <div class="flex justify-between mb-4">
          <div v-for="n in 3" :key="n" class="flex-1 h-2 mx-1 rounded-md" :class="{ 'bg-button1': mushroomStep >= n, 'bg-border2': mushroomStep < n }"></div>
        </div>

        <p class="text-text1-faded text-sm mb-2">{{ stepDescriptions[mushroomStep - 1] }}</p>

        <div class="text-center text-sm text-text1 mb-2">
          <div v-if="!mushroomInProgress[mushroomStep]">
            <button
              type="button"
              class="underline cursor-pointer text-button2-meta focus:outline-none focus:ring"
              @click="popupInputRef?.click()"
              data-testid="upload-button"
            >
              {{ t('submit.upload') }}
            </button>
          </div>
          <div v-else class="space-y-2">
            <img :src="imagePreviews[mushroomStep]" alt="preview" class="max-h-40 mx-auto rounded border border-border1" />
            <button
              type="button"
              class="text-xs underline cursor-pointer text-button2-meta focus:outline-none focus:ring"
              @click="popupInputRef?.click()"
              data-testid="change-upload-button"
            >
              {{ t('submit.changeUpload') }}
            </button>
          </div>
          <input id="popupFileInput" type="file" class="hidden" @change="handlePopupUpload" ref="popupInputRef" />
        </div>

        <div class="flex justify-between">
          <BaseButton variant="3" class="w-[45%]" @click="prevStep" :disabled="mushroomStep === 1" data-testid="prev-step-button">{{ t('submit.back') }}</BaseButton>
          <BaseButton variant="2" class="w-[45%]" @click="nextStep" :disabled="!mushroomInProgress[mushroomStep]" data-testid="next-step-button">
            {{ mushroomStep === 3 ? t('submit.finish') : t('submit.next') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>

      <!-- Navigation warning modal -->
    <div
      v-if="navigationWarningVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      data-testid="leave-warning"
    >
      <div class="bg-bg1 border border-border1 rounded-2xl p-6 w-[90%] max-w-md text-center shadow-xl">
        <h3 class="text-xl font-semibold mb-4" data-testid="ready-question">
          {{ t('submit.readyQuestion') }}
        </h3>
        <p class="text-text1-faded mb-6" data-testid="ready-detail">
          {{ t('submit.readyDetail') }}
        </p>
        <div class="flex justify-center gap-4">
          <BaseButton variant="2" @click="cancelNavigation" data-testid="cancel-leave">
            {{ t('submit.cancel') }}
          </BaseButton>
          <BaseButton @click="confirmAndLeave" data-testid="confirm-leave">
            {{ t('submit.proceedButton') }}
          </BaseButton>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { sendNewUserRequest } from '@/services/rest/userRequestService.js'
import { processImageFiles } from '@/utils/imageUtils'
import { XIcon, Upload } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'

const { t, tm } = useI18n()
const toast = useToast()
const router = useRouter()
const emit = defineEmits(['next'])

const hintStep = ref(null)
const comment = ref('')
const mushrooms = ref([])
const showErrorComment = ref(false)
const showErrorMushroom = ref(false)
const loading = ref(false)

const showMushroomPopup = ref(false)
const mushroomStep = ref(1)
const popupInputRef = ref(null)

const mushroomInProgress = ref({ 1: null, 2: null, 3: null })
const imagePreviews = ref({ 1: null, 2: null, 3: null })

const navigationWarningVisible = ref(false)
const pendingNavigation = ref(null)

const steps = computed(() => tm('submit.steps'))

const stepDescriptions = computed(() => [
  t('submit.stepDescription.top'),
  t('submit.stepDescription.side'),
  t('submit.stepDescription.under')
])

onBeforeRouteLeave((to, from, next) => {
  if (!navigationWarningVisible.value && (comment.value || mushrooms.value.length)) {
    navigationWarningVisible.value = true
    pendingNavigation.value = next
  } else {
    next()
  }
})

function confirmAndLeave() {
  if (pendingNavigation.value) {
    pendingNavigation.value()
    pendingNavigation.value = null
  }
}

function cancelNavigation() {
  navigationWarningVisible.value = false
  pendingNavigation.value = null
}

function toggleHint(step) {
  hintStep.value = hintStep.value === step ? null : step
}

function getStepName(step) {
  return step === 1 ? 'top' : step === 2 ? 'side' : 'bot'
}

function getNextAvailableId() {
  const usedIds = new Set(mushrooms.value.map(m => m.id))
  let id = 1
  while (usedIds.has(id)) id++
  return id
}

function removeMushroom(id) {
  mushrooms.value = mushrooms.value.filter(m => m.id !== id)
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handlePopupUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const dataURL = await fileToBase64(file)
  file.dataURL = dataURL
  mushroomInProgress.value[mushroomStep.value] = file
  imagePreviews.value[mushroomStep.value] = dataURL
  event.target.value = null
}

async function nextStep() {
  if (mushroomStep.value < 3) {
    mushroomStep.value++
  } else {
    const imagesRaw = Object.entries(mushroomInProgress.value)
      .filter(([_, file]) => file)
      .map(([step, file]) => ({ file, name: `angle_${getStepName(Number(step))}.jpg` }))

    const { processedFiles } = await processImageFiles(
      imagesRaw.map(i => i.file),
      mushrooms.value.flatMap(m => m.images),
      imagesRaw.map(i => i.name)
    )

    mushrooms.value.push({
      id: getNextAvailableId(),
      images: processedFiles
    })

    resetMushroomPopup()
  }
}

function prevStep() {
  if (mushroomStep.value > 1) mushroomStep.value--
}

function cancelMushroom() {
  resetMushroomPopup()
}

function resetMushroomPopup() {
  mushroomInProgress.value = { 1: null, 2: null, 3: null }
  imagePreviews.value = { 1: null, 2: null, 3: null }
  mushroomStep.value = 1
  showMushroomPopup.value = false
}

async function handleSubmit() {
  showErrorComment.value = comment.value.trim() === ''
  showErrorMushroom.value = mushrooms.value.length === 0
  if (showErrorComment.value || showErrorMushroom.value) return

  loading.value = true
  try {
    const result = await sendNewUserRequest(comment.value, mushrooms.value)
    if (result) {
      localStorage.removeItem('submit_comment')
      localStorage.removeItem('submit_mushrooms')
      emit('next', result)
    } else {
      toast.error('Noe gikk galt. Prøv igjen.')
    }
  } catch (err) {
    toast.error('Innsending feilet.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (process.env.NODE_ENV !== 'test') {
    const savedComment = localStorage.getItem('submit_comment')
    if (savedComment) comment.value = savedComment

    const savedMushrooms = localStorage.getItem('submit_mushrooms')
    if (savedMushrooms) {
      try {
        const parsed = JSON.parse(savedMushrooms)
        mushrooms.value = parsed.map(m => ({
          id: m.id,
          images: m.images.map(img => {
            const arr = img.dataURL.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            const u8arr = new Uint8Array(bstr.length)
            for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i)
            const file = new File([u8arr], img.name, { type: mime })
            file.dataURL = img.dataURL
            return file
          })
        }))
      } catch (e) {
        console.warn('Feil ved rekonstruksjon av sopp:', e)
      }
    }
  }
})

onUnmounted(() => {
  comment.value = ''
  mushrooms.value = []
  localStorage.removeItem('submit_comment')
  localStorage.removeItem('submit_mushrooms')
})

watch(comment, (val) => {
  localStorage.setItem('submit_comment', val)
})

watch(mushrooms, async (val) => {
  const simplified = []
  for (const m of val) {
    const images = await Promise.all(
      m.images.map(async img => {
        const dataURL = img.dataURL || await fileToBase64(img)
        return { name: img.name, dataURL }
      })
    )
    simplified.push({ id: m.id, images })
  }
  localStorage.setItem('submit_mushrooms', JSON.stringify(simplified))
}, { deep: true })
</script>
