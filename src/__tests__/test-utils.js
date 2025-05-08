import { render } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import i18n, { updateI18nLocale } from '@/locales/i18n'
import { createPinia, setActivePinia } from 'pinia'
import { useLanguageStore } from '@/store/useLanguageStore'
import en from '@/locales/en.json'
import no from '@/locales/no.json'

const routes = [
  { path: '/', name: 'home', component: {} },
  { path: '/new-request', name: 'new-request', component: {} },
  { path: '/become-member', name: 'become-member', component: {} },
  { path: '/user/support', name: 'support', component: {} },
]

// Setup Pinia and locale before running tests
function setupI18n(locale = 'en') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const languageStore = useLanguageStore()
  
  // Populate messages manually
  languageStore.messages = { en, no }
  languageStore.locale = locale

  // Update i18n dynamically (matches your app's behavior)
  updateI18nLocale()
}

const customRender = (component, options = {}) => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  // Call setupI18n before rendering the component
  setupI18n('en')

  return render(component, {
    global: {
      plugins: [router, i18n],
    },
    ...options,
  })
}

export * from '@testing-library/vue'
export { customRender }
