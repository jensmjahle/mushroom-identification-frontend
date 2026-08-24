<template>
  <div class="flex flex-col items-center justify-center w-[90%] h-full px-4 pt-5 pb-4 max-w-3xl mx-auto text-center gap-6 overflow-y-auto relative">
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
        <XIcon class="w-4 h-4 text-text1-faded hover:text-danger absolute top-2 right-2 cursor-pointer" tabindex="0" @click="removeMushroom(mushroom.id)" />
        <div class="font-semibold text-text1 text-left mb-1">
          {{ t('submit.mushroom') }} {{ mushroom.id }}
        </div>
        <div class="flex flex-wrap gap-2">
          <img
            v-for="(img, i) in mushroom.images"
            :key="i"
            :src="getImagePreviewUrl(img)"
            :alt="img.name"
            class="w-12 h-12 rounded object-cover border border-border1"
          />
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
        class="self-stretch w-[15%] flex items-center justify-center min-h-[140px]"
        @click="showMushroomPopup = true"
        data-testid="add-mushroom-button"
      >
        <MushroomAddIcon class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
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
          <h3 class="text-lg font-semibold text-text1">{{ t('submit.addMushroomTitle') }}</h3>
          <BaseButton variant="4" class="text-xs" @click="cancelMushroom" data-testid="close-popup">{{ t('submit.close') }}</BaseButton>
        </div>

        <p class="text-text1-faded text-sm mb-2">{{ t('submit.addMushroomHint') }}</p>

        <!-- All three angles shown at once, fillable in any order -->
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="angle in angles"
            :key="angle.key"
            class="flex flex-col items-center gap-1 text-center"
            :title="angle.description"
            :data-testid="`angle-slot-${angle.key}`"
          >
            <p class="text-xs font-semibold text-text1">{{ angle.label }}</p>

            <div
              v-if="!angleFiles[angle.key]"
              class="w-full aspect-square border-2 border-dashed border-border2 rounded-lg flex items-center justify-center p-1"
            >
              <button
                type="button"
                class="text-xs underline cursor-pointer text-button2 focus:outline-none focus:ring"
                @click="fileInputs[angle.key]?.click()"
                :data-testid="`upload-button-${angle.key}`"
              >
                {{ t('submit.upload') }}
              </button>
            </div>
            <div v-else class="w-full space-y-1">
              <img
                :src="angleFiles[angle.key].dataURL"
                alt="preview"
                class="w-full aspect-square object-cover rounded border border-border1"
              />
              <button
                type="button"
                class="text-[11px] underline cursor-pointer text-button2 focus:outline-none focus:ring"
                @click="fileInputs[angle.key]?.click()"
                :data-testid="`change-upload-button-${angle.key}`"
              >
                {{ t('submit.changeUpload') }}
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              class="hidden"
              :ref="(el) => (fileInputs[angle.key] = el)"
              @change="(e) => handleAngleUpload(angle.key, e)"
              :data-testid="`file-input-${angle.key}`"
            />
          </div>
        </div>

        <div class="flex justify-between">
          <BaseButton variant="3" class="w-[45%]" @click="cancelMushroom" data-testid="cancel-mushroom-button">
            {{ t('submit.cancel') }}
          </BaseButton>
          <BaseButton
            variant="2"
            class="w-[45%]"
            :disabled="!allAnglesFilled"
            @click="addMushroom"
            data-testid="add-mushroom-confirm-button"
          >
            {{ t('submit.addMushroom') }}
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
import { XIcon } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import MushroomAddIcon from '@/components/base/MushroomAddIcon.vue'

const { t, tm } = useI18n()
const toast = useToast()
const emit = defineEmits(['next'])

const hintStep = ref(null)
const comment = ref('')
const mushrooms = ref([])
const showErrorComment = ref(false)
const showErrorMushroom = ref(false)
const loading = ref(false)

const showMushroomPopup = ref(false)

// Three independently-fillable angle slots, rather than a forced sequential
// wizard - lets the user upload whichever photo they have on hand first,
// while still keeping the top/side/underside distinction the identification
// actually depends on.
const ANGLE_FILENAME_SUFFIX = { top: 'top', side: 'side', under: 'bot' }
const fileInputs = {}
const angleFiles = ref({ top: null, side: null, under: null })

const angles = computed(() => [
  { key: 'top', label: t('submit.angleTop'), description: t('submit.stepDescription.top') },
  { key: 'side', label: t('submit.angleSide'), description: t('submit.stepDescription.side') },
  { key: 'under', label: t('submit.angleUnder'), description: t('submit.stepDescription.under') }
])

const allAnglesFilled = computed(() =>
  angles.value.every((angle) => angleFiles.value[angle.key])
)

const navigationWarningVisible = ref(false)
const pendingNavigation = ref(null)

const steps = computed(() => tm('submit.steps'))

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

function getNextAvailableId() {
  const usedIds = new Set(mushrooms.value.map(m => m.id))
  let id = 1
  while (usedIds.has(id)) id++
  return id
}

// Thumbnails in the mushroom list read from a File's dataURL when it has one
// (set for images restored from sessionStorage), otherwise from a blob URL
// created lazily and cached on the File itself so it isn't recreated on every
// render.
function getImagePreviewUrl(img) {
  if (img.dataURL) return img.dataURL
  if (!img.previewUrl) img.previewUrl = URL.createObjectURL(img)
  return img.previewUrl
}

function revokeImagePreviewUrls(images) {
  for (const img of images) {
    if (img.previewUrl) URL.revokeObjectURL(img.previewUrl)
  }
}

function removeMushroom(id) {
  const removed = mushrooms.value.find(m => m.id === id)
  if (removed) revokeImagePreviewUrls(removed.images)
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

async function handleAngleUpload(angleKey, event) {
  const file = event.target.files?.[0]
  if (!file) return

  // Check file size before anything else. This is the raw, pre-downscale source
  // file - processImageFiles() will shrink it well below this regardless, so this
  // is really just a guard against trying to load something absurd (e.g. a RAW
  // file) into memory, not the limit users are expected to normally hit.
  if (file.size > 50 * 1024 * 1024) {
    toast.error(t('errors.FileTooLarge'))
    event.target.value = null
    return
  }

  const dataURL = await fileToBase64(file)
  file.dataURL = dataURL
  angleFiles.value = { ...angleFiles.value, [angleKey]: file }
  event.target.value = null
}

async function addMushroom() {
  if (!allAnglesFilled.value) return

  const imagesRaw = Object.entries(angleFiles.value)
    .filter(([_, file]) => file)
    .map(([key, file]) => ({ file, name: `angle_${ANGLE_FILENAME_SUFFIX[key]}.jpg` }))

  const { processedFiles, error } = await processImageFiles(
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

function cancelMushroom() {
  resetMushroomPopup()
}

function resetMushroomPopup() {
  angleFiles.value = { top: null, side: null, under: null }
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
      sessionStorage.removeItem('submit_comment')
      sessionStorage.removeItem('submit_mushrooms')
      emit('next', result)
    }
  } catch (err) {
    toast.error(t('errors.sendingUserRequest'))
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (process.env.NODE_ENV !== 'test') {
    const savedComment = sessionStorage.getItem('submit_comment')
    if (savedComment) comment.value = savedComment

    const savedMushrooms = sessionStorage.getItem('submit_mushrooms')
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
        console.warn('Error when reconstructing the mushroom:', e)
      }
    }
  }
})

onUnmounted(() => {
  for (const mushroom of mushrooms.value) revokeImagePreviewUrls(mushroom.images)
  comment.value = ''
  mushrooms.value = []
  sessionStorage.removeItem('submit_comment')
  sessionStorage.removeItem('submit_mushrooms')
})

watch(comment, (val) => {
  sessionStorage.setItem('submit_comment', val)
})

watch(mushrooms, async (val) => {
  if (val.length > 0) showErrorMushroom.value = false
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
  sessionStorage.setItem('submit_mushrooms', JSON.stringify(simplified))
}, { deep: true })
</script>
