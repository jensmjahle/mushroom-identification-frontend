import { createI18n } from 'vue-i18n';
import { useLanguageStore } from '../store/useLanguageStore'; // Import Pinia store

// Create i18n instance with no default messages
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en',  // Default language
  fallbackLocale: 'en', // Fallback language
  messages: {}, // We'll set the messages dynamically
});

// Function to update the i18n locale and messages based on Pinia store
export function updateI18nLocale() {
  const languageStore = useLanguageStore(); // Access the Pinia store
  i18n.global.locale.value = languageStore.locale; // Set the locale dynamically
  i18n.global.setLocaleMessage(languageStore.locale, languageStore.messages[languageStore.locale]); // Update the messages
}

export default i18n;
