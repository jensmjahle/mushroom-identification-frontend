<template>
  <div class="w-full h-full flex items-center justify-center px-4 py-6">
    <div class="w-full max-w-3xl h-full flex flex-col text-center px-4 py-6 sm:py-10 sm:px-8 rounded-lg">

      <h1 class="text-xl sm:text-2xl font-bold text-text1 mb-4">
        {{ t('membership.title') }}
      </h1>

      <div
          class="mt-4 flex-1 bg-bg1 rounded-2xl p-2 border shadow-md border-border1 overflow-y-auto w-full text-left prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-10"
          v-html="renderedContent">
      </div>

      <div class="mt-auto pt-4">
        <button
            data-testid="become-member-button"
            @click="handleBecomeMemberClick"
            class="btn-1 px-4 py-2 text-sm font-bold rounded shadow hover:bg-button1-hover transition duration-300"
        >
          {{ t('membership.cta') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { logBecomeMemberPress } from '@/services/rest/statsService.js'

const { t, locale } = useI18n()
const renderedContent = ref('')

async function loadMembershipContent() {
  try {
    const lang = locale.value || 'no'
    const res = await fetch(`/content/member/membership.${lang}.txt`)
    const raw = await res.text()
    renderedContent.value = marked.parse(raw)
  } catch (err) {
    console.error('Feil ved lasting av medlemskapstekst:', err)
    renderedContent.value = '<p>Innhold ikke tilgjengelig.</p>'
  }
}

async function handleBecomeMemberClick() {
  try {
    await logBecomeMemberPress()
  } catch (error) {
    console.warn('Logging failed, redirecting anyway')
  } finally {
    window.open('https://portal.smartorg.no/action/reg/7fd64a16', '_blank')
  }
}

onMounted(loadMembershipContent)
watch(locale, loadMembershipContent)
</script>
