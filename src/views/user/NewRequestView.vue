<template>
  <div class="main-user-view">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-textAlt">{{ $t('submit.title') }}</h1>
    </div>

    <!-- Collapsible Steps -->
    <div v-for="(step, index) in steps" :key="index" class="mb-4 border rounded">
      <button
          @click="toggleStep(index)"
          class="w-full text-left px-4 py-3 bg-bgAlt text-text font-semibold hover:bg-button2 transition"
      >
        {{ index + 1 }}. {{ $t(`submit.steps.${index}.title`) }}
      </button>
      <div v-if="activeStep === index" class="px-4 py-3 text-sm bg-white text-chat-other border-t">
        <p>{{ $t(`submit.steps.${index}.description`) }}</p>
        <img v-if="step.image" :src="step.image" alt="Step Visualized" class="mt-2 rounded shadow max-w-full" />
      </div>
    </div>

    <!-- Image Upload -->
    <div class="mb-6">
      <label class="block mb-2 font-semibold text-textAlt">{{ $t('submit.imageUpload') }}</label>
      <input
          type="file"
          multiple
          accept="image/*"
          @change="handleImageUpload"
          class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-button file:text-white hover:file:bg-button-hover"
      />

      <!-- Image Previews -->
      <div v-if="previewUrls.length" class="mt-4 grid grid-cols-2 gap-4">
        <div
            v-for="(url, index) in previewUrls"
            :key="index"
            class="relative border rounded overflow-hidden shadow"
        >
          <img :src="url" alt="Preview" class="w-full h-40 object-cover" />
          <button
              @click="removeImage(index)"
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              :title="$t('submit.removeImage')"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Text Input -->
    <div class="mb-6">
      <label class="block mb-2 font-semibold text-textAlt">{{ $t('submit.message') }}</label>
      <textarea
          v-model="text"
          rows="4"
          :placeholder="$t('submit.placeholder')"
          class="w-full p-3 border text-textAlt rounded bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-button2"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <div class="text-center">
      <button
          @click="submitRequest"
          :disabled="!isValid"
          class="bg-button hover:bg-button-hover text-text px-6 py-2 rounded disabled:opacity-50"
      >
        {{ $t('submit.button') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {sendNewUserRequest} from "../../services/apiService.js";

const steps = [
  { image: '/assets/step1.jpg' },
  { image: '/assets/step2.jpg' },
  { image: null },
];


const activeStep = ref(null);
const toggleStep = (index) => {
  activeStep.value = activeStep.value === index ? null : index;
};

const text = ref('');
const images = ref([]);
const previewUrls = ref([]);

const handleImageUpload = (event) => {
  const newFiles = Array.from(event.target.files);

  newFiles.forEach(file => {
    images.value.push(file);
    previewUrls.value.push(URL.createObjectURL(file));
  });

  event.target.value = ''; // reset input so re-uploading the same file works
};

const removeImage = (index) => {
  images.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
};

const isValid = computed(() => {
  return text.value.trim() !== '' && images.value.length > 0;
});


const submitRequest = async () => {
  try {
    const referenceCode = await sendNewUserRequest(text.value, images.value);
    alert(`Request submitted! Reference code: ${referenceCode}`);
    text.value = '';
    images.value = [];
    previewUrls.value = [];
  } catch (error) {
    alert('Failed to submit the request.');
  }
};
</script>
