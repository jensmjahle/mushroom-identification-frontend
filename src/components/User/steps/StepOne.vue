<template>
    <div class="flex flex-col items-center justify-center gap-6 mt-[10%] mb-[10%] h-[80%] max-h-[700px] max-w-md w-full text-center">
      <h2 class="text-2xl font-bold text-text1">New mushroom</h2>
  
      <!-- Step Info List -->
      <div class="flex flex-col gap-4 text-left w-full">
        <div class="flex gap-4 items-center cursor-pointer" @click="toggleHint(1)">
          <span class="w-8 h-8 text-sm rounded-md bg-button3 text-white flex items-center justify-center font-semibold shrink-0">1</span>
          <div class="max-w-[calc(100%-2.5rem)]">
            <p class="font-medium text-text1 line-clamp-2">Legg alle soppene nummerert på et ark og ta bilder med god belysning.</p>
          </div>
        </div>
        <div class="flex gap-4 items-center cursor-pointer" @click="toggleHint(2)">
          <span class="w-8 h-8 text-sm rounded-md bg-button3 text-white flex items-center justify-center font-semibold shrink-0">2</span>
          <div class="max-w-[calc(100%-2.5rem)]">
            <p class="font-medium text-text1 line-clamp-2">Send inn og husk referansekoden du får oppgitt.</p>
          </div>
        </div>
        <div class="flex gap-4 items-center cursor-pointer" @click="toggleHint(3)">
          <span class="w-8 h-8 text-sm rounded-md bg-button3 text-white flex items-center justify-center font-semibold shrink-0">3</span>
          <div class="max-w-[calc(100%-2.5rem)]">
            <p class="font-medium text-text1 line-clamp-2">Kom tilbake om en dag eller to og sjekk svaret.</p>
          </div>
        </div>
      </div>
  
      <!-- Hint Popup -->
      <div v-if="hintStep !== null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-bg1 p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h3 class="text-lg font-semibold mb-2">Tips</h3>
          <p class="text-sm text-text1-faded">
            {{ hintMessages[hintStep] }}
          </p>
          <button class="mt-4 btn-1 w-full" @click="hintStep = null">Lukk</button>
        </div>
      </div>
  
      <!-- Uploaded Files List -->
      <div class="w-full flex flex-col gap-3 border border-gray-300 rounded p-3 h-52 overflow-y-auto">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="relative w-full bg-white border rounded p-2 flex-shrink-0"
        >
          <div class="flex justify-between items-center">
            <span>{{ file.name }}</span>
            <XIcon class="w-4 h-4 text-gray-500 hover:text-red-500 cursor-pointer" @click="removeFile(index)" />
          </div>
        </div>
      </div>
  
      <!-- Drag and Drop Area -->
      <div class="w-full border-2 border-dashed border-gray-300 rounded p-4 text-sm text-gray-500 text-center">
        Drag files here or <label for="fileInput" class="text-green-600 cursor-pointer underline">browse</label>
        <input id="fileInput" type="file" class="hidden" @change="handleFileUpload" multiple />
      </div>
  
      <!-- Kommentar -->
      <textarea
        class="w-full p-2 border rounded text-sm"
        rows="3"
        placeholder="Skriv inn kommentar her .."
        v-model="comment"
      ></textarea>
  
      <!-- Submit Button -->
      <button class="btn-1 w-full" @click="$emit('next')">
        Send in photos
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { XIcon } from 'lucide-vue-next';
  
  const hintStep = ref(null);
  const uploadedFiles = ref([]);
  const comment = ref('');
  
  const hintMessages = {
    1: 'Tips: Bruk dagslys og legg soppen på et lyst underlag.',
    2: 'Koden brukes for å hente resultatet senere.',
    3: 'Du kan bruke referansekoden for å logge inn.'
  };
  
  function toggleHint(step) {
    hintStep.value = hintStep.value === step ? null : step;
  }
  
  function removeFile(index) {
    uploadedFiles.value.splice(index, 1);
  }
  
  function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    uploadedFiles.value.push(...files.map(file => ({ name: file.name })));
    event.target.value = null; // Reset input so same file can be reselected if needed
  }
  </script>
  