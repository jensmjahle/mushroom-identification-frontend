<template>
  <div class="w-full h-full flex items-center justify-center px-4 py-6">
    <div class="w-full max-w-3xl h-full flex flex-col text-center px-4 py-6 sm:py-10 sm:px-8 rounded-lg">
      
      <!-- Tittel (fast topp) -->
      <h1 class="text-xl sm:text-2xl font-bold text-text1 mb-4">
        {{ t('support.title') }}
      </h1>

      <!-- Scrollbart innhold -->
      <div class="flex-1 overflow-y-auto">
        <!-- Dynamic Markdown Content -->
        <div
          class="text-left prose prose-sm sm:prose-base dark:prose-invert max-w-none text-text1"
          v-html="renderedContent"
        />

        <!-- Kontaktseksjon -->
        <div class="text-left w-full space-y-4 mt-10">
          <h2 class="text-lg font-semibold text-text1 text-center">
            {{ t('support.contactTitle') }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-text1 mb-1">
                {{ t('support.emailLabel') }}
              </label>
              <input
                type="email"
                v-model="email"
                required
                class="w-full border border-border2 rounded p-2 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-text1 mb-1">
                {{ t('support.messageLabel') }}
              </label>
              <textarea
                v-model="message"
                rows="4"
                required
                class="w-full border border-border2 rounded p-2 text-xs sm:text-sm resize-none"
              ></textarea>
            </div>

            <BaseButton type="submit" block :variant="1" class="text-sm sm:text-base">
              {{ t('support.submitButton') }}
            </BaseButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import { marked } from 'marked'

const { t, locale } = useI18n()
const email = ref('')
const message = ref('')
const renderedContent = ref('')

// Dynamisk lasting av språkbasert tekstfil
async function loadSupportText() {
  try {
    const lang = locale.value || 'no'
    const res = await fetch(`/content/support.${lang}.txt`)
    const raw = await res.text()
    renderedContent.value = marked.parse(raw)
  } catch (e) {
    console.error(`Kunne ikke laste supporttekst for "${locale.value}"`, e)
    renderedContent.value = '<p>Innhold ikke tilgjengelig.</p>'
  }
}

function handleSubmit() {
  console.log('Sending message:', email.value, message.value)
}

onMounted(loadSupportText)

watch(locale, loadSupportText)
</script>
