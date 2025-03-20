import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import './assets/tailwind.css'
import i18n from './locales/i18n';


createApp(App).use(i18n).mount('#app')
