import { createI18n } from 'vue-i18n'

// Dynamically load all JSON files in the current folder
const languageFiles = import.meta.glob('./*.json', { eager: true })

const messages = {}

for (const path in languageFiles) {
  const matched = path.match(/\.\/([a-z]{2})\.json$/)
  if (matched) {
    const locale = matched[1]
    messages[locale] = languageFiles[path].default
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export function updateI18nLocale() {
  const stored = sessionStorage.getItem('locale')
  if (stored && Object.keys(messages).includes(stored)) {
    i18n.global.locale.value = stored
  } else {
    i18n.global.locale.value = 'en'
    sessionStorage.setItem('locale', 'en')
  }
}

export default i18n
