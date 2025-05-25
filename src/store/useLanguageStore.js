import { defineStore } from 'pinia'

// Dynamically import all locale files
const languageFiles = import.meta.glob('../locales/languages/*.json', { eager: true })

const messages = {}
for (const path in languageFiles) {
  const match = path.match(/languages\/([a-z]{2})\.json$/)
  if (match) {
    const lang = match[1]
    messages[lang] = languageFiles[path].default
  }
}

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: sessionStorage.getItem('locale') || 'no',
    messages: {
      en,
      no,
    },
  }),
  actions: {
    setLanguage(lang) {
      if (this.messages[lang]) {
        this.locale = lang;
        sessionStorage.setItem('locale', lang);
      }
    },
  },
})
