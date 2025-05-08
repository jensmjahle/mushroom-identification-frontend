import { createI18n } from 'vue-i18n'
import { render } from '@testing-library/vue'
import en from '@/locales/en.json'
import no from '@/locales/no.json'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'

const messages = { en, no }

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

i18n.global.locale.value = 'en'

export function customRender(component, options = {}) {
  return render(component, {
    global: {
      plugins: [i18n, router, createTestingPinia()],
      ...options?.global
    },
    ...options
  })
}
