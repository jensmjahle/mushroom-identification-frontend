<template>
  <div class="flex flex-col items-center justify-center w-[90%] h-full px-4 pt-20 pb-4 max-w-3xl mx-auto text-center gap-6 overflow-y-auto relative z-0">
    <h2 class="text-2xl sm:text-3xl font-bold text-text1">{{ t('submit.title') }}</h2>

    <!-- Tips -->
    <div class="flex flex-col gap-4 text-left w-full">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center gap-4 p-2 rounded-md border border-border1 bg-bg1 cursor-pointer transition hover:bg-bg2 shadow-sm"
        @click="toggleHint(index + 1)"
      >
        <span class="w-8 h-8 text-sm rounded-md bg-button3 text-button3-meta flex items-center justify-center font-semibold shrink-0">
          {{ index + 1 }}
        </span>
        <p class="text-sm font-medium text-text1">{{ step.title }}</p>
        <svg class="ml-auto w-5 h-5 text-text1-faded" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01"/>
        </svg>
      </div>
    </div>

    <!-- Hint Modal -->
    <div v-if="hintStep !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="hintStep = null">
      <div class="bg-bg1 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-2 text-text1">{{ t('submit.hintTitle') }}</h3>
        <p class="text-sm text-text1-faded">{{ t(`submit.steps.${hintStep - 1}.hint`) }}</p>
        <BaseButton class="w-full mt-4" @click="hintStep = null">{{ t('submit.close') }}</BaseButton>
      </div>
    </div>

    <!-- Tidligere sopper -->
    <div class="flex w-full flex-row gap-6 items-start">
      <div class="flex-1 border border-border1 rounded px-2 h-[120px] overflow-y-auto bg-bg2 w-full relative">
        <div class="sticky top-0 left-0 z-10 bg-bg2 pb-2 font-semibold text-text1 text-left">{{ t('submit.mushroomListTitle') }}</div>
        <template v-if="mushrooms.length">
          <div
            v-for="mushroom in mushrooms"
            :key="mushroom.id"
            class="relative border border-border1 rounded p-2 bg-bg1 mb-2"
          >
            <XIcon class="w-4 h-4 text-text1-faded hover:text-button1-meta absolute top-2 right-2 cursor-pointer" @click="removeMushroom(mushroom.id)" />
            <div class="font-semibold text-text1 text-left mb-1">{{ t('submit.mushroom') }} {{ mushroom.id }}</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="(img, i) in mushroom.images" :key="i" class="bg-bg1 border border-border1 rounded px-2 py-1 text-xs text-text1">
                {{ img.name }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="text-text1-faded text-sm text-center">{{ t('submit.noMushrooms') }}</p>
        </template>
        <p v-if="showErrorMushroom" class="text-sm text-red-500 mt-1">{{ t('submit.validation.errorMushroomMissing') }}</p>
      </div>

      <BaseButton variant="2" class="h-full w-[10%]" @click="showMushroomPopup = true">+</BaseButton>
    </div>

    <!-- Kommentar -->
    <div class="w-full relative">
      <textarea
        class="w-full p-2 border border-border1 rounded text-sm resize-none min-h-[70px] text-text1 bg-bg1"
        rows="3"
        :placeholder="showErrorComment ? t('submit.validation.errorCommentMissing') : t('submit.commentPlaceholder')"
        v-model="comment"
        :class="showErrorComment ? 'border-red-500 text-red-500 placeholder-red-500' : ''"
      />
    </div>

    <!-- Send -->
    <BaseButton class="w-full max-w-xs flex items-center justify-center gap-2" @click="handleSubmit" :disabled="loading">
      <svg v-if="loading" class="animate-spin h-5 w-5 text-text1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <span>{{ t('submit.send') }}</span>
    </BaseButton>

    <!-- Popup -->
    <div v-if="showMushroomPopup" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-bg1 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-text1">{{ t('submit.step') }} {{ mushroomStep }} {{ t('submit.of') }} 3</h3>
          <BaseButton variant="4" class="text-xs" @click="cancelMushroom">{{ t('submit.close') }}</BaseButton>
        </div>

        <div class="flex justify-between mb-4">
          <div v-for="n in 3" :key="n" class="flex-1 h-2 mx-1 rounded-md" :class="{ 'bg-button1': mushroomStep >= n, 'bg-border2': mushroomStep < n }"></div>
        </div>

        <p class="text-text1-faded text-sm mb-2">{{ stepDescriptions[mushroomStep - 1] }}</p>

        <div class="text-center text-sm text-text1 mb-2">
          <div v-if="!mushroomInProgress[mushroomStep]">
            <label for="popupFileInput" class="underline cursor-pointer text-button2">{{ t('submit.upload') }}</label>
          </div>
          <div v-else class="space-y-2">
            <img :src="imagePreviews[mushroomStep]" alt="preview" class="max-h-40 mx-auto rounded border border-border1" />
            <label for="popupFileInput" class="text-xs underline cursor-pointer text-button2">{{ t('submit.changeUpload') }}</label>
          </div>
          <input id="popupFileInput" type="file" class="hidden" @change="handlePopupUpload" ref="popupInputRef" />
        </div>

        <div class="flex justify-between">
          <BaseButton variant="3" class="w-[45%]" @click="prevStep" :disabled="mushroomStep === 1">{{ t('submit.back') }}</BaseButton>
          <BaseButton variant="2" class="w-[45%]" @click="nextStep" :disabled="!mushroomInProgress[mushroomStep]">
            {{ mushroomStep === 3 ? t('submit.finish') : t('submit.next') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { sendNewUserRequest } from '@/services/userRequestService'
import { processImageFiles } from '@/utils/imageUtils'
import { XIcon } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'

const { t, tm } = useI18n()
const toast = useToast()
const emit = defineEmits(['next'])

const hintStep = ref(null)
const comment = ref('')
const showErrorComment = ref(false)
const showErrorMushroom = ref(false)
const loading = ref(false)

const showMushroomPopup = ref(false)
const mushroomStep = ref(1)
const popupInputRef = ref(null)

const mushroomInProgress = ref({ 1: null, 2: null, 3: null })
const imagePreviews = ref({ 1: null, 2: null, 3: null })
const mushrooms = ref([])

const steps = computed(() => tm('submit.steps'))

const stepDescriptions = [
  t('submit.stepDescription.top'),
  t('submit.stepDescription.side'),
  t('submit.stepDescription.under')
]

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

async function handlePopupUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  mushroomInProgress.value[mushroomStep.value] = file
  imagePreviews.value[mushroomStep.value] = URL.createObjectURL(file)
  event.target.value = null
}

async function nextStep() {
  if (mushroomStep.value < 3) {
    mushroomStep.value++
  } else {
    const imagesRaw = Object.entries(mushroomInProgress.value)
      .filter(([_, file]) => file)
      .map(([step, file]) => ({
        file,
        name: `angle_${getStepName(Number(step))}.jpg`
      }))

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
</script>
