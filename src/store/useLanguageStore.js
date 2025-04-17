import { defineStore } from 'pinia';
import en from '../locales/en.json'; // Import English translations
import no from '../locales/no.json'; // Import Norwegian translations

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: localStorage.getItem('locale') || 'no',
    messages: {
      en,
      no,
    },
  }),
  actions: {
    setLanguage(lang) {
      if (this.messages[lang]) {
        this.locale = lang;
        localStorage.setItem('locale', lang);
      }
    },
  },
});
