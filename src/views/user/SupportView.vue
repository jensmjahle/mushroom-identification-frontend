<template>
    <div class="support-page container">
      <div class="pt-10">
        <h1 class="text-2xl font-bold text-center text-text1 mb-4">
          {{ t('support.title') }}
        </h1>
  
        <p class="text-text1-faded mb-4 text-center">
          {{ t('support.intro') }}
        </p>
  
        <!-- FAQ Section -->
        <div class="mb-4 ml-6">
          <h2 class="text-xl font-semibold text-text1 text-center mb-4">
            {{ t('support.faqTitle') }}
          </h2>
          <ul class="space-y-4">
            <li>
              <h3 class="text-lg font-medium text-text1 mb-1">
                {{ t('support.faq1.question') }}
              </h3>
              <p class="text-text1-faded">
                {{ t('support.faq1.answer') }}
              </p>
            </li>
            <li>
              <h3 class="text-lg font-medium text-text1 mb-1">
                {{ t('support.faq2.question') }}
              </h3>
              <p class="text-text1-faded">
                <router-link to="/user/login" class="text-text4 underline">
                  {{ t('support.faq2.link') }}
                </router-link>
                {{ t('support.faq2.rest') }}
              </p>
            </li>
            <li>
              <h3 class="text-lg font-medium text-text1 mb-1">
                {{ t('support.faq3.question') }}
              </h3>
              <p class="text-text1-faded">
                {{ t('support.faq3.answer') }}
              </p>
            </li>
          </ul>
        </div>
  
        <!-- Contact Form -->
        <div class="bg-bg2 p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-text1 mb-4">
            {{ t('support.contactTitle') }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-sm font-medium text-text1 mb-1">
                {{ t('support.emailLabel') }}
              </label>
              <input
                type="email"
                v-model="email"
                required
                class="w-full border rounded p-2 text-sm"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-text1 mb-1">
                {{ t('support.messageLabel') }}
              </label>
              <textarea
                v-model="message"
                rows="4"
                required
                class="w-full border rounded p-2 text-sm"
              ></textarea>
            </div>
            <button class="btn-1 w-full">
              {{ t('support.submitButton') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  const { t } = useI18n();
  const email = ref('');
  const message = ref('');
  
  function handleSubmit() {
    console.log('Sending message:', email.value, message.value);
    // TODO: implement backend submission
  }
  </script>
  