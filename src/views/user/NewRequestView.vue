<template>
  <div class="bg-bgAlt2 border border-chat-border rounded-lg shadow p-4 w-full max-w-2xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-textAlt">Submit Your Mushroom Request</h1>
    </div>

    <!-- Collapsible Steps -->
    <div v-for="(step, index) in steps" :key="index" class="mb-4 border rounded">
      <button
          @click="toggleStep(index)"
          class="w-full text-left px-4 py-3 bg-bgAlt text-text font-semibold hover:bg-button2 transition"
      >
        {{ index + 1 }}. {{ step.title }}
      </button>
      <div v-if="activeStep === index" class="px-4 py-3 text-sm bg-white text-chat-other border-t">
        <p>{{ step.description }}</p>
        <img v-if="step.image" :src="step.image" alt="Step Visualized" class="mt-2 rounded shadow max-w-full">
      </div>
    </div>

    <!-- Image Upload -->
    <div class="mb-6">
      <label class="block mb-2 font-semibold text-textAlt">Upload Images</label>
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
              title="Remove image"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Text Input -->
    <div class="mb-6">
      <label class="block mb-2 font-semibold text-textAlt">Write us a message</label>
      <textarea
          v-model="text"
          rows="4"
          placeholder="Write here..."
          class="w-full p-3 border rounded bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-button2"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <div class="text-center">
      <button
          @click="submitRequest"
          :disabled="!isValid"
          class="bg-button hover:bg-button-hover text-white px-6 py-2 rounded disabled:opacity-50"
      >
        Submit Request
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const steps = [
  {
    title: 'Take a picture of the mushroom',
    description: 'Make sure the mushroom is clearly visible in good lighting.',
    image: '/assets/step1.jpg'
  },
  {
    title: 'Note the environment',
    description: 'Forest, field, stump, etc. This helps us identify the species.',
    image: '/assets/step2.jpg'
  },
  {
    title: 'Avoid touching unknown mushrooms',
    description: 'Use gloves or tools to handle if needed.',
    image: null
  },
  {
    title: 'Submit your request',
    description: 'Describe the mushroom and where you found it. Include any other relevant information.',
    image: null
  }
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

  event.target.value = ''; // reset input so re-uploading same file works
};

const removeImage = (index) => {
  images.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
};

const isValid = computed(() => {
  return text.value.trim() !== '' && images.value.length > 0;
});

const submitRequest = async () => {
  const formData = new FormData();
  formData.append('text', text.value);
  images.value.forEach(file => formData.append('images', file));

  try {
    const response = await axios.post('/api/requests/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    alert(`Request submitted! Reference code: ${response.data}`);
    text.value = '';
    images.value = [];
    previewUrls.value = [];
  } catch (err) {
    console.error('Error submitting:', err);
    alert('Failed to submit your request.');
  }
};
</script>
