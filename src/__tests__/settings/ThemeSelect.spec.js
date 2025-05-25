// src/__tests__/user/components/settings/ThemeSelect.spec.js
import { mount } from '@vue/test-utils'
import ThemeSelect from '@/components/settings/ThemeSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'


vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key
    })
  }
})

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query) => ({
    matches: query.includes('dark'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  })))

  vi.stubGlobal('sessionStorage', {
    getItem: vi.fn(() => 'dark'),
    setItem: vi.fn()
  })

  const old = document.getElementById('theme-style')
  if (old) old.remove()
})

describe('ThemeSelect.vue', () => {
  it('applies saved theme on mount', () => {
    mount(ThemeSelect, {
      global: {
        components: { BaseButton }
      }
    })

    const link = document.getElementById('theme-style')
    expect(link).not.toBeNull()
    expect(link.href).toContain('/themes/dark.css')
  })

  it('renders two buttons with correct variants', () => {
    const wrapper = mount(ThemeSelect, {
      global: {
        components: { BaseButton }
      }
    })

    const buttons = wrapper.findAllComponents(BaseButton)
    expect(buttons).toHaveLength(2)
    expect(buttons[0].props('variant')).toBe('1') // light is not active
    expect(buttons[1].props('variant')).toBe('4') // dark is active
  })

  it('updates theme when button is clicked', async () => {
    const wrapper = mount(ThemeSelect, {
      global: {
        components: { BaseButton }
      }
    })

    const buttons = wrapper.findAllComponents(BaseButton)
    await buttons[0].trigger('click') 

    const link = document.getElementById('theme-style')
    expect(link.href).toContain('/themes/light.css')
    expect(sessionStorage.setItem).toHaveBeenCalledWith('theme', 'light')
  })
})
