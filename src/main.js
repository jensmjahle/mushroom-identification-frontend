import { createApp } from 'vue';
import { createPinia } from 'pinia';  // Import Pinia for state management
import App from './App.vue';
import './assets/tailwind.css';
import i18n, { updateI18nLocale } from './locales/i18n'; // Import i18n and update function
import router from './router';
import { initTheme } from './composables/useTheme'

// Create the Pinia store instance
const pinia = createPinia();

// Create the Vue app instance
const app = createApp(App);

// Use the necessary plugins: Pinia, i18n, and router
app.use(pinia);
app.use(i18n);
app.use(router);

initTheme()

// Ensure the language updates dynamically when the app starts
updateI18nLocale(); 

// Mount the app to the DOM once
app.mount('#app');
