import { createI18n } from 'vue-i18n'
import en from './en.json'
import no from './no.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en', 
  fallbackLocale: 'en',
  messages: {
    en,
    no
  }
})

export function updateI18nLocale() {
  const stored = sessionStorage.getItem('locale')
  if (stored && ['en', 'no'].includes(stored)) {
    i18n.global.locale.value = stored
  } else {
    i18n.global.locale.value = 'en'
    sessionStorage.setItem('locale', 'en')
  }
}


export default i18n
