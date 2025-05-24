<template>
  <div class="w-full flex justify-center px-4 py-6">
    <div class="w-full max-w-3xl flex flex-col text-center px-4 py-6 sm:py-10 sm:px-8 rounded-lg">
      <!-- Title -->
      <h1 class="text-xl sm:text-2xl font-bold text-text1 mb-4">
        {{ t('support.title') }}
      </h1>

      <!-- Scrollable content -->
      <div class="shadow-md bg-bg1 rounded-2xl p-4 pr-2 custom-scrollbar">
        <!-- Markdown Content -->
        <div
          class="text-left prose prose-sm sm:prose-base dark:prose-invert max-w-none text-text1"
          v-html="renderedContent"
        />

        <!-- TODO: Enable contact form once backend implementation is ready -->
        <div v-if="false" class="text-left w-full space-y-4 mt-10">
          <h2 class="text-lg font-semibold text-text1 text-center">
            {{ t('support.contactTitle') }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="supportEmail" class="block text-xs sm:text-sm font-medium text-text1 mb-1">
                {{ t('support.emailLabel') }}
              </label>
              <input
                id="supportEmail"
                type="email"
                v-model="email"
                :placeholder="t('support.emailLabel')"
                required
                class="w-full border border-border2 rounded p-2 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label for="supportMessage" class="block text-xs sm:text-sm font-medium text-text1 mb-1">
                {{ t('support.messageLabel') }}
              </label>
              <textarea
                id="supportMessage"
                v-model="message"
                rows="4"
                :placeholder="t('support.messageLabel')"
                required
                class="w-full border border-border2 rounded p-2 text-xs sm:text-sm resize-none"
              ></textarea>
            </div>

            <BaseButton type="submit" block :variant="'1'" class="text-sm sm:text-base">
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

async function loadSupportText() {
  try {
    const lang = locale.value || 'no'
    const res = await fetch(`/content/support/support.${lang}.txt`)
    const raw = await res.text()
    renderedContent.value = marked.parse(raw)
  } catch (e) {
    console.error(`Could not load support text for "${locale.value}"`, e)
    renderedContent.value = '<p>Content unavailable.</p>'
  }
}

function handleSubmit() {
  console.log('Sending message:', email.value, message.value)
}

onMounted(loadSupportText)
watch(locale, loadSupportText)
</script>

