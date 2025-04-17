import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/tailwind.css';
import i18n, { updateI18nLocale } from './locales/i18n';
import router from './router';
import { setTheme } from './composables/useTheme'
import { themeReady } from './composables/themeReady'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'




const saved = localStorage.getItem('theme') || 'light'
setTheme(saved, () => {
  themeReady.value = true
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(i18n)
app.use(router)
app.use(Toast)

// 4. Update i18n language
updateI18nLocale()

// 5. Mount app
app.mount('#app')
