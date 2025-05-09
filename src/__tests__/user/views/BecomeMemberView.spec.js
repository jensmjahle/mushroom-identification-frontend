// src/__tests__/user/views/BecomeMemberView.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BecomeMemberView from '@/views/user/BecomeMemberView.vue'
import { ref } from 'vue'

// Mock vue-i18n globally
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key,
      tm: (key) => key,
      locale: ref('en'),
    }),
  }
})

// Stub fetch to return mock markdown content
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('# Membership Content\nThis is mock membership content.')
  })
))

describe('BecomeMemberView.vue', () => {
  it('renders membership content and verifies form submission button', async () => {
    const wrapper = mount(BecomeMemberView)

    await flushPromises()

    // Title is rendered
    expect(wrapper.text()).toContain('membership.title')

    // CTA button is rendered with expected text and href
    const ctaButton = wrapper.find('a')
    expect(ctaButton.exists()).toBe(true)
    expect(ctaButton.text()).toContain('membership.cta')
    expect(ctaButton.attributes('href')).toBe('https://portal.smartorg.no/action/reg/7fd64a16')

    // Rendered markdown content is loaded
    const prose = wrapper.find('.prose')
    expect(prose.exists()).toBe(true)
    expect(prose.html()).toContain('This is mock membership content.')
  })
})
