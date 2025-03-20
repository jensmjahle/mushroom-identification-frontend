import { createI18n } from 'vue-i18n';
import en from './en.json';
import no from './no.json';

const i18n = createI18n({
  legacy: false,  
  locale: 'en',   // Default language
  fallbackLocale: 'en',
  messages: { en, no }
});

export default i18n;
