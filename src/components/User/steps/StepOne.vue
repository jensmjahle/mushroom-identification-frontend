<template>
  <div class="flex flex-col items-center justify-center w-full px-4 sm:px-6 py-10 max-w-3xl mx-auto text-center gap-6">
    <h2 class="text-2xl sm:text-3xl font-bold text-text1">{{ t('submit.title') }}</h2>

    <!-- Step Info List -->
    <div class="flex flex-col gap-4 text-left w-full">
      <div
        v-for="n in 3"
        :key="n"
        class="flex gap-4 items-center cursor-pointer"
        @click="toggleHint(n)"
      >
        <span class="w-8 h-8 text-sm rounded-md bg-button3 text-white flex items-center justify-center font-semibold shrink-0">
          {{ n }}
        </span>
        <div class="flex-1">
          <p class="font-medium text-text1 line-clamp-2">
            {{ t(`submit.steps.${n - 1}.title`) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Hint Modal -->
    <div v-if="hintStep !== null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-bg1 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-2">{{ t('submit.hintTitle') }}</h3>
        <p class="text-sm text-text1-faded">
          {{ t(`submit.steps.${hintStep - 1}.hint`) }}
        </p>
        <button class="mt-4 btn-1 w-full" @click="hintStep = null">{{ t('submit.close') }}</button>
      </div>
    </div>

    <!-- File Preview List -->
    <div class="w-full border border-gray-300 rounded p-3 max-h-60 overflow-y-auto flex flex-col gap-3">
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="relative w-full bg-white border rounded p-2"
      >
        <div class="flex justify-between items-center">
          <span class="truncate">{{ file.name }}</span>
          <XIcon class="w-4 h-4 text-gray-500 hover:text-red-500 cursor-pointer" @click="removeFile(index)" />
        </div>
      </div>
    </div>

    <!-- File Upload Input -->
    <div class="w-full border-2 border-dashed border-gray-300 rounded p-4 text-sm text-gray-500 text-center">
      {{ t('submit.upload') }}
      <label for="fileInput" class="text-green-600 cursor-pointer underline">
        {{ t('submit.browse') }}
      </label>
      <input id="fileInput" type="file" class="hidden" @change="handleFileUpload" multiple />
    </div>

    <!-- Comment -->
    <textarea
      class="w-full p-2 border rounded text-sm"
      rows="3"
      :placeholder="t('submit.commentPlaceholder')"
      v-model="comment"
    />

    <!-- Submit -->
    <button class="btn-1 w-full max-w-xs" @click="$emit('next')">
      {{ t('submit.send') }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { XIcon } from 'lucide-vue-next';
import { processImageFiles } from '@/utils/imageUtils';

const { t } = useI18n();
const hintStep = ref(null);
const uploadedFiles = ref([]);
const comment = ref('');

function toggleHint(step) {
  hintStep.value = hintStep.value === step ? null : step;
}

function removeFile(index) {
  uploadedFiles.value.splice(index, 1);
}

async function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  const { processedFiles, error } = await processImageFiles(files, uploadedFiles.value);
  if (error) {
    console.error('Image processing error:', error);
  }

  uploadedFiles.value.push(...processedFiles);
  event.target.value = null;
}
</script>
