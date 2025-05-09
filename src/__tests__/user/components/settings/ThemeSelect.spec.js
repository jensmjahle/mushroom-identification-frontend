// src/__tests__/user/components/settings/ThemeSelect.spec.js
import { mount } from '@vue/test-utils'
import ThemeSelect from '@/components/settings/ThemeSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// 💡 Mock vue-i18n to provide $t
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
  // 💡 Mock matchMedia
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query) => ({
    matches: query.includes('dark'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  })))

  // 💡 Mock localStorage
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(() => 'dark'),
    setItem: vi.fn()
  })

  // Fjern gammel theme-style hvis den finnes
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
    await buttons[0].trigger('click') // Click "light"

    const link = document.getElementById('theme-style')
    expect(link.href).toContain('/themes/light.css')
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
  })
})
