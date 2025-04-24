<template>
  <div class="w-full h-full flex items-center justify-center px-4 py-6 overflow-y-scroll">
    <div
      class="w-full max-w-3xl flex flex-col items-center text-center px-4 py-6 sm:py-10 sm:px-8 rounded-lg overflow-y-auto"
    >
      <div class="flex flex-col items-center gap-5 w-full max-w-xl">
        <!-- Title -->
        <h1 class="text-xl sm:text-2xl font-bold text-text1">
          {{ t('support.title') }}
        </h1>

        <!-- Intro -->
        <p class="text-base text-text1-faded leading-snug">
          {{ t('support.intro') }}
        </p>

        <!-- FAQ Section -->
        <div class="text-left w-full space-y-4">
          <h2 class="text-lg font-semibold text-text1 text-center">
            {{ t('support.faqTitle') }}
          </h2>

          <div class="space-y-2">
            <div>
              <h3 class="font-medium text-text1 text-sm sm:text-base mb-1">
                {{ t('support.faq1.question') }}
              </h3>
              <p class="text-text1-faded text-xs sm:text-sm leading-snug">
                {{ t('support.faq1.answer') }}
              </p>
            </div>

            <div>
              <h3 class="font-medium text-text1 text-sm sm:text-base mb-1">
                {{ t('support.faq2.question') }}
              </h3>
              <p class="text-text1-faded text-xs sm:text-sm leading-snug">
                <router-link to="/user/login" class="text-text4 underline">
                  {{ t('support.faq2.link') }}
                </router-link>
                {{ t('support.faq2.rest') }}
              </p>
            </div>

            <div>
              <h3 class="font-medium text-text1 text-sm sm:text-base mb-1">
                {{ t('support.faq3.question') }}
              </h3>
              <p class="text-text1-faded text-xs sm:text-sm leading-snug">
                {{ t('support.faq3.answer') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="text-left w-full space-y-4">
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'

const { t } = useI18n()
const email = ref('')
const message = ref('')

function handleSubmit() {
  console.log('Sending message:', email.value, message.value)
  // TODO: backend integration
}
</script>
