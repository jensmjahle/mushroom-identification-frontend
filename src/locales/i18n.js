import { createI18n } from 'vue-i18n';
import en from './en.json';
import no from './no.json';

const i18n = createI18n({
  legacy: false,  
  locale: 'no',   // Default language
  fallbackLocale: 'en',
  messages: { en, no }
});

export default i18n;
