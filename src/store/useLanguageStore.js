import { defineStore } from 'pinia';
import en from '../locales/en.json'; // Import English translations
import no from '../locales/no.json'; // Import Norwegian translations

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: 'no', // Default language is Norwegian
    messages: {
      en,  // English translations
      no,  // Norwegian translations
    },
  }),
  actions: {
    setLanguage(lang) {
      if (this.messages[lang]) {
        this.locale = lang; 
      }
    },
  },
});