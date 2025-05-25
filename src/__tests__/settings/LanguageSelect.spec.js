import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import LanguageSelect from '@/components/settings/LanguageSelect.vue'

const messages = {
  en: {
    settings: {
      language: 'Language',
      languages: { en: 'English', no: 'Norwegian' }
    }
  },
  no: {
    settings: {
      language: 'Språk',
      languages: { en: 'Engelsk', no: 'Norsk' }
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

describe('LanguageSelect.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
  })

  it('renders correctly with real store and i18n', () => {
    const wrapper = mount(LanguageSelect, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('Language')
    const options = wrapper.findAll('option')
    expect(options).toHaveLength(2)
    expect(options[0].text()).toBe('English')
    expect(options[1].text()).toBe('Norwegian')
  })

  it('changes language and updates sessionStorage on selection', async () => {
    const wrapper = mount(LanguageSelect, {
      global: {
        plugins: [i18n]
      }
    })

    const select = wrapper.find('select')
    await select.setValue('no')

    expect(i18n.global.locale.value).toBe('no')
    expect(sessionStorage.getItem('locale')).toBe('no')
  })
})
